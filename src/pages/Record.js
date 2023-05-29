import styled from "styled-components";
import Modal from "../components/RecordModal";
import { useState, useRef, useEffect } from "react";
import RecordModalImg from "../assets/RecordModal.svg";
import useRecorder from "../hooks/useRecorder";
import SttService from "../services/stt.service";
import useEventSource from "../hooks/useEventSource";
import { StereoAudioRecorder } from "recordrtc";

const Record = () => {
  const speechRetRef = useRef();
  const STREAM_URL_PREFIX = "http://localhost:8089/stream/";
  let [userId, setUserId] = useState("sample_user");
  let [sessionId, setSessionId] = useState("INVALID");
  let [url, setUrl] = useState(STREAM_URL_PREFIX + sessionId);

  useEffect(() => {
    if (sessionId == "INVALID") {
      SttService.createSession(userId)
        .then((res) => {
          let newSessionId = res?.data?.sessionId;
          if (newSessionId == undefined) {
            console.log("err");
            return;
          }
          setSessionId(newSessionId);
          setUrl(STREAM_URL_PREFIX + newSessionId);
        })
        .catch((e) => console.log(e));
    }
    console.log(sessionId);
  }, [userId]);
  const { dataRef, setCallback } = useEventSource(url);
  const startButtonRef = useRef();
  const stopButtonRef = useRef();
  const [isRecording, setIsRecording] = useState(false);
  const [isPause, setIsPause] = useState(false);
  const recorderOnDataAvailable = (blob: Blob) => {
    console.log("recorderOnDataAvailable");
    SttService.upload(blob, "fooo", userId, sessionId)
      .then((res) => {})
      .catch((e) => console.log("upload error"));
    return;
  };
  const { startRecording, stopRecording, mediaStream } = useRecorder(
    {
      mimeType: "audio/wav",
      type: "audio",
      recorderType: StereoAudioRecorder,
      numberOfAudioChannels: 1,
      desiredSampRate: 16000,
      timeSlice: 3000,
      ondataavailable: recorderOnDataAvailable,
    },
    recorderOnDataAvailable
  );
  const startRecordingWrapper = () => {
    startRecording();
    setIsRecording(true);
    // TODO
    // startButtonRef.current.hidden = true;
    // stopButtonRef.current.hidden = false;
  };
  const stopRecordingWrapper = () => {
    stopRecording();
    setIsRecording(false);
    // startButtonRef.current.hidden = false;
    // stopButtonRef.current.hidden = true;
  };
  const pauseRecordingWraaper = () => {
    setIsPause(true);
  };
  const resumeRecordingWrapper = () => {
    setIsPause(false);
  };
  useEffect(() => {
    console.log(setCallback);
    if (setCallback == undefined) {
      return;
    }
    setCallback((data) => {
      console.log("callback");
      console.log(data);
      speechRetRef.current.innerHTML = data;
    });
  }, [setCallback]);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const lists = ["장점: 메모리~", "방식: 코어가~"];
  const makelist = () => {
    return (
      <StyledUl>
        {lists.map((list, index) => (
          <li key={index}>{list}</li>
        ))}
      </StyledUl>
    );
  };

  return (
    <>
      <RecordContainer>
        <InfoContainer>
          <Title>2023년 4월 17일자 수업</Title>
          <OtherInfo>
            <TagArea>
              <Tags>#수업</Tags>
              <Tags>#서강대학교</Tags>
              <Tags>#OS</Tags>
            </TagArea>
            <Button>강의자료 다시 업로드</Button>
          </OtherInfo>
        </InfoContainer>
        <RecordArea>
          <Text>🎙️ 실시간 녹음</Text>
          <RecordBox ref={speechRetRef}>
            시스템에 엘원 엘투 L3 캐시가 있다는 것을 들어보셨을 겁니다 CPU가
            여기 있으면 L1 L2 L3 캐쉬가 이런 식으로 있습니다 음아 OS가 누마
            aware라는 것은 코어가 작업을 할 때 CPU의 스레드와 가까운 메모리를
            배정한다는 겁니다 프로세서 affinity와의 절충안이라고 볼 수 있고 최신
            OS들은 거의 다 누마 어웨시스템에 엘원 엘투 L3 캐시가 있다는 것을
            들어보셨을 겁니다 CPU가 여기 있으면 L1 L2 L3 캐쉬가 이런 식으로
            있습니다 음아 OS가 누마 aware라는 것은 코어가 작업을 할 때 CPU의
            스레드와 가까운 메모리를 배정한다는 겁니다 프로세서 affinity와의
            절충안이라고 볼 수 있고 최신 OS들은 거의 다 누마 어웨시스템에 엘원
            엘투 L3 캐시가 있다는 것을 들어보셨을 겁니다 CPU가 여기 있으면 L1 L2
            L3 캐쉬가 이런 식으로 있습니다 음아 OS가 누마 aware라는 것은 코어가
            작업을 할 때 CPU의 스레드와 가까운 메모리를 배정한다는 겁니다
            프로세서 affinity와의 절충안이라고 볼 수 있고 최신 OS들은 거의 다
            누마 어웨시스템에 엘원 엘투 L3 캐시가 있다는 것을 들어보셨을 겁니다
            CPU가 여기 있으면 L1 L2 L3 캐쉬가 이런 식으로 있습니다 음아 OS가
            누마 aware라는 것은 코어가 작업을 할 때 CPU의 스레드와 가까운
            메모리를 배정한다는 겁니다 프로세서 affinity와의 절충안이라고 볼 수
            있고 최신 OS들은 거의 다 누마 어웨
          </RecordBox>
          {!isRecording && (
            <RecordButton ref={startButtonRef} onClick={startRecordingWrapper}>
              녹음 시작
            </RecordButton>
          )}
          {isRecording && (
            <WhileRecord>
              {!isPause && (
                <PauseButton onClick={pauseRecordingWraaper}>
                  일시정지
                </PauseButton>
              )}
              {isPause && (
                <ResumeBotton onClick={resumeRecordingWrapper}>
                  재개
                </ResumeBotton>
              )}
              <StopButton ref={stopButtonRef} onClick={stopRecordingWrapper}>
                녹음 완료
              </StopButton>
            </WhileRecord>
          )}
        </RecordArea>
        <SummaryArea>
          <SummaryInfo>
            <Text>📝 실시간 요약본</Text>
          </SummaryInfo>
          <FileName>파일명: 230417_1632</FileName>
          <SummaryBox>
            <SummarySmallTitle>4. Multi-threaded Cores</SummarySmallTitle>
            {makelist()}
            <SummarySeparator />
            <SummaryBigTitle>
              <BigTitleKeyword>#키워드4</BigTitleKeyword>
              <BigTitle>SMP Load Balancing</BigTitle>
            </SummaryBigTitle>
            <SummarySmallTitle>1. Processor Affinity</SummarySmallTitle>
            <SummarySpan>Memory Locality~</SummarySpan>
            <SummarySmallTitle>2. Load Balancing의 종류</SummarySmallTitle>
            {makelist()}
            <SummarySmallTitle>4. Multi-threaded Cores</SummarySmallTitle>
            {makelist()}
            <SummarySeparator />
            <SummaryBigTitle>
              <BigTitleKeyword>#키워드4</BigTitleKeyword>
              <BigTitle>SMP Load Balancing</BigTitle>
            </SummaryBigTitle>
            <SummarySmallTitle>1. Processor Affinity</SummarySmallTitle>
            <SummarySpan>Memory Locality~</SummarySpan>
            <SummarySmallTitle>2. Load Balancing의 종류</SummarySmallTitle>
            {makelist()}
          </SummaryBox>
        </SummaryArea>
      </RecordContainer>
      <ModalButton onClick={handleOpenModal}>
        <ModalPic src={RecordModalImg} />
      </ModalButton>
      <Modal show={showModal} handleClose={handleCloseModal}></Modal>
    </>
  );
};

export default Record;

const RecordContainer = styled.div`
  padding-top: 150px;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 1;
`;

const InfoContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-top: 25px;
`;

const Title = styled.div`
  font-size: 30px;
  display: flex-start;
  font-weight: 700;
`;

const OtherInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
`;

const TagArea = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Tags = styled.div`
  background-color: #f2e9f8;
  border-radius: 5px;
  color: #914688;
  font-size: 16px;
  height: 30px;
  display: flex;
  align-items: center;
  margin-right: 5px;
`;

const Button = styled.div`
  text-decoration-line: underline;
`;

const RecordArea = styled.div`
  width: 50%;
  dispaly: flex;
  flex-direction: column;
  margin-top: 25px;
`;

const Text = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

const RecordBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  background: #f4f6fb;
  border-radius: 10px;
  height: 110px;
  margin-top: 5px;
  padding: 10px;
  overflow: auto;
  font-weight: 500;
  font-size: 16px;
  line-height: 23px;
`;

const RecordButton = styled.div`
  background: #1e70f6;
  border-radius: 5px;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  height: 40px;
  margin-top: 12px;
  cursor: pointer;
`;

const WhileRecord = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StopButton = styled.div`
  background: #1e70f6;
  border-radius: 5px;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-top: 12px;
  cursor: pointer;
  height: 40px;
  width: 49%;
`;

const PauseButton = styled.div`
  border-radius: 5px;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  cursor: pointer;
  height: 40px;
  width: 49%;
  background: #f5f5f5;
  color: #81868a;
`;

const ResumeBotton = styled.div`
  border-radius: 5px;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  cursor: pointer;
  height: 40px;
  width: 49%;
  background: #e8f0fe;
  color: #1e70f6;
`;

const SummaryArea = styled.div`
  width: 50%;
  dispaly: flex;
  flex-direction: column;
  margin-top: 35px;
`;

const SummaryInfo = styled.div``;
const FileName = styled.div`
  text-align: right;
  color: #81868a;
`;
const SummaryBox = styled.div`
  box-sizing: border-box;
  padding: 20px;
  background: #f4f6fb;
  border-radius: 10px;
  height: 400px;
  width: 100%;
  margin-top: 5px;
  overflow: auto;
`;

const SummarySmallTitle = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  color: #000000;
`;

const StyledUl = styled.ul`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 26px;
  color: #81868a;
  margin-top: 0px;
  margin-bottom: 20px;
`;

const SummarySeparator = styled.hr`
  margin-left: -20px;
  margin-right: -20px;
  border-top: 1.5px solid #babcbe;
`;

const SummaryBigTitle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const BigTitleKeyword = styled.div`
  background: #e8f0fe;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 4px;
  display: flex;
  align-items: center;
  color: #1e70f6;
  font-weight: 700;
  font-size: 18px;
  line-height: 15px;
`;

const BigTitle = styled.div`
  font-weight: 700;
  font-size: 22px;
  line-height: 15px;
  display: flex;
  align-items: center;
  margin-left: 14px;
`;

const SummarySpan = styled.div`
  color: #81868a;
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 500;
`;

const ModalPic = styled.img``;

const ModalButton = styled.div`
  background: #ffffff;
  box-shadow: 0px 3px 10px 5px rgba(0, 0, 0, 0.15);
  width: 90px;
  height: 90px;
  border: transparent;
  position: fixed;
  border-radius: 50%;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
