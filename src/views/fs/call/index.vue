<template>
  <div>
    <div>
      <Row :gutter="24">
        <Col :span="24">拨打状态：{{ pushStats.videoEnable?'视频电话': '音频电话'}}</Col>
        <Col :span="24">客服名称：{{ agentStats.agentName }}</Col>
        <Col :span="24">客服客服账号：{{ agentStats.agentKey }}</Col>
        <Col :span="24">客服客服工号：{{ agentStats.agentId }}</Col>
        <Col :span="24">客服登录类型：{{ agentStats.loginType }}</Col>
        <Col :span="24">客服状态：{{ agentStats.agentState }}</Col>
        <Col :span="24">客服推流地址：{{ agentStats.mediaAddress }}</Col>
      </Row>
    </div>
    <div :class="`${prefixCls}-left bg-black grid row-span-15`">
      <FsRtcPlay 
        ref="fsRtcPlay"
        :sendSdpApi="sendSdpApi" 
        :muted ="false"
      />
    </div>
    <BasicForm @register="register" />
    <Button size="small"   @click="handleOk">拨打</Button>
    <Button size="small"   @click="handleHangUp">挂机</Button>
    <Button size="small"   @click="handleDtmf">按键号码</Button>
    <Switch size="small"    v-model:checked="pushStats.videoEnable" />
    <Button size="small"   @click="handleAgentStats">更新客服状态</Button>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref,unref ,onBeforeMount,onUnmounted } from 'vue';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import rootSocketEmitter from '@/hooks/socket/rootSocketEmitter';
  import {
    SocketNamespace,
    SocketInEvent,
    SocketOutEvent,
    ResultEnum,
  } from '@/enums/SocketEnum';
  import { Button,Row,Col,Switch } from 'ant-design-vue';
  import { useSocketStore } from '@/store/modules/socket';
  import { useDesign } from '@/hooks/web/useDesign';
  import { FsRtcPlay } from '@/components/Video';
  import { useFsSocket } from '@/hooks/socket';
  import { useMessage} from '@/hooks/web/useMessage';

  const fsRtcPlay = ref();
  const emit = defineEmits(['success', 'register']);
  const useSocket = useSocketStore();
  const { createMessage,createConfirm } = useMessage();
  const { prefixCls } = useDesign('video-play');

  const stats = reactive({
    callId : '',
    isCall:false,//是否主动接听
    //主动拨打参数
    caller : '',
    timeout : null as any,//超时定时器
    inCallRingConfirm : {} as any,
  })

  const agentStats = reactive({
    agentState: '',//坐席状态
    agentName: '',//坐席名称
    agentKey: '',//坐席账户
    agentId: '',//坐席工号
    mediaAddress: '',//分配的流媒体地址（推送用）
    loginType: '',//登录方式
  });

  const pushStats = reactive({
    recvSdp: "",
    audioEnable: true,
    videoEnable: false,
    recvOnly: false,
    debug: true,
    useDtmf:true,
	  useCamera: true,
  });

  const schemas: FormSchema[] = [
    {
      field: 'mobile',
      component: 'Input',
      label: '被叫号码',
      colProps: {
        span: 6,
      },
      required: true,
    },
    {
      field: 'dtmf',
      component: 'Input',
      label: '按键号码',
      colProps: {
        span: 6,
      }
    },
  ]

  const [register, {validate }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    showActionButtonGroup: false,
  });


  const handleAgentStats = ()=>{
     //登录成功后 请求坐席信息
     useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_STATUS, {
      updateStatus: 1,//是否更新信息坐席状态 默认不更新
    });
  }

  const handleDtmf =async()=>{
    if(!unref(fsRtcPlay)?.success){
      createMessage.error('webrtp加载失败');
      return;
    }
    const { dtmf } =await validate();
    if(!dtmf){
      createMessage.error('请输入拨号号码');
      return;
    }
    unref(fsRtcPlay)?.sendDtmf(dtmf)
  }
  const handleOk = async ()=>{
    if(!unref(fsRtcPlay)?.success){
      createMessage.error('webrtp加载失败');
      return;
    }
    const { mobile } =await validate();
    if(!mobile){
      createMessage.error('请输入号码');
      return;
    }
    stats.isCall = true;
    stats.caller = mobile;
    unref(fsRtcPlay)?.call(pushStats);
  }
  const sendSdpApi = (sdp) => {
    return new Promise((resolve,reject) => {
      if(stats.isCall){
        //客服拨打电话回调
        rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_CALL_PHONE, (val) => {
          const { code, message, data } = val as Recordable;
          if (code != ResultEnum.SUCCESS) {
            hangUp();
            reject(message || '获取消息错误');
            rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_PHONE);
            return;
          }
          stats.callId = data?.callId;
          const type = data?.type;//  ON_RING_BACK：回铃音  ON_CALL:接听电话
          if('ON_CALL' === type){
            stats.timeout && clearInterval(stats.timeout);
            rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_PHONE);
          }
          resolve(data);
        });
        //开始拨号
        useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_CALL_PHONE, {
          type:pushStats.videoEnable?'CALL_VIDEO_PHONE':'CALL_AUDIO_PHONE',
          caller: stats.caller,//拨打号码
          sdp: sdp,
        });
        stats.timeout = setTimeout(()=>{
          hangUp();
          rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_PHONE);
          createMessage.error('获取用户sdp超时');
          stats.timeout && clearInterval(stats.timeout);
          reject('获取拨打用户sdp超时');
        },15000)
      }else{
        //客服拨打电话回调
        rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION, (val) => {
          stats.timeout && clearInterval(stats.timeout);
          const { code, message} = val as Recordable;
          if (code != ResultEnum.SUCCESS) {
            hangUp();
            reject(message || '获取消息错误');
            rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION);
            return;
          }
          resolve({sdp:pushStats.recvSdp});
          rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION);
        });
        useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_CALL_NOTIFICATION, {
          type:2,
          callId:stats.callId,
          sdp:sdp,
        });
        stats.timeout = setTimeout(()=>{
          hangUp();
          rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_CALL_NOTIFICATION);
          createMessage.error('来电回调失败');
          stats.timeout && clearInterval(stats.timeout);
          reject('来电回调失败');
        },15000)
      }
    });
  };

  const hangUp = ()=>{
    //关闭推流
    stats.callId = '';
    stats.timeout && clearInterval(stats.timeout);
    stats.isCall = false;
    pushStats.recvSdp = '';
    pushStats.recvOnly= false;
    unref(fsRtcPlay)?.destroy();
    stats.inCallRingConfirm = {}
  }
  const handleHangUp = () =>{
    //发送挂机命令
    useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_HANG_UP_PHONE, {callId:stats.callId});
  }

  onBeforeMount(()=>{
    //进入页面加载客服socket
    useFsSocket('ws://192.168.1.20:9092/','/socket.io');
    //登陆成功回调
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_STATUS);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_LOGIN);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_PUSH_PATH);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_PUSH_PATH_LOGOUT);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_HANG_UP_PHONE);
    rootSocketEmitter.off(SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION);
    
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_LOGIN, (val) => {
      const { code, message } = val as Recordable;
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        return;
      }
      //登录成功后 请求坐席信息
      useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_STATUS, {
        updateStatus: 0,//是否更新信息坐席状态 默认不更新
      });
    });

    //客服信息回调
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_STATUS, (val) => {
      const { code, message, data } = val as Recordable;
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        return;
      }
      const {agentState,agentName,agentKey,agentId,mediaAddress,loginType} = data as Recordable;
      agentStats.agentState =agentState;
      agentStats.agentName = agentName;
      agentStats.agentKey = agentKey;
      agentStats.agentId = agentId;
      agentStats.mediaAddress = mediaAddress;
      agentStats.loginType = loginType;
      createMessage.info(message);
    });

   
    //接收挂机回调
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_HANG_UP_PHONE, (val) => {
      const { code, message } = val as Recordable;
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        return;
      }
      hangUp();
      createMessage.info(message || '获取消息错误');
    });
    //客服事件消息
    rootSocketEmitter.on(SocketOutEvent.AGENT_OUT_PHONE_NOTIFICATION, (val) => {
      const { code, message , data} = val as Recordable;
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        Object.keys(stats.inCallRingConfirm).forEach(o=>{
          stats.inCallRingConfirm[o].destroy();
        })
        hangUp();
        return;
      }
      //各种事件处理
      handleNotification(data);
    });
  })
  //开始处理回调事件
  const handleNotification = ({agentState,callId,data}) =>{
    if('IN_CALL_RING' === agentState){
      //呼入来电振铃
      handleInCallRing(callId,data);
    }else if('TALKING' === agentState){
      const {callType} = data
      if('INNER_CALL' === callType){
        //对方已接通等待连接
        createMessage.info('对方已接通等待连接');
      }
    }else{
      console.log("暂不支持此类型事件：",agentState);
    }
  }
  //呼入来电处理
  const handleInCallRing = (callId,data) =>{
    const {callType,caller,sdp,onVideo} = data
    if(!['INNER_CALL','INBOUND_CALL'].includes(callType)){
      return
    }
    if(stats.inCallRingConfirm[callId]){
      return;
    }
    pushStats.videoEnable = onVideo ===1;
    stats.inCallRingConfirm[callId] = createConfirm({
      iconType: 'warning',
      title: () => 'INNER_CALL'===callType?'内部呼叫':'外部呼叫',
      content: () => '号码：'+caller,
      okText:'接听',
      onOk: () => {
        stats.callId = callId;
        pushStats.recvOnly= true;
        pushStats.recvSdp = sdp;
        unref(fsRtcPlay)?.call(pushStats);
      },
      cancelText:'拒绝',
      onCancel: ()=>{
        useSocket.sendMessage(SocketNamespace.AGENT_NAMESPACE, SocketInEvent.AGENT_IN_CALL_NOTIFICATION, {
          type:1,
          callId
        });
        hangUp();
        createMessage.success('已拒接');
      }
    })
  }
  onUnmounted(()=>{
    hangUp();
  })
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-video-play';
  .@{prefix-cls} {
    min-height: 380px;
    &-left {
      width: 500px;
    }
  }

</style>