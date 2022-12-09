import React, { useState , useRef, useEffect} from 'react';
import './App.css';
import { createTypePredicateNodeWithModifier } from 'typescript';

type QSO = {
  time: Date,
  callSign: string,
  sendRST: string,
  rcvdRST: string
}

type TableProps = {
  qs : QSO[]
}

const createTimeStr = (time: Date) => time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds()

const Table:React.FC<TableProps> = ({qs}) => {
  return(<>
    <thead>
      <tr>
        <th>Time</th>
        <th>CallSign</th>
        <th>sendRST</th>
        <th>rcvdRST</th>
      </tr>
    </thead>
    <tbody id="logtable">
      {qs.map((q :QSO) =>
      <tr>
        <td>{createTimeStr(q.time)}</td>
        <td>{q.callSign}</td>
        <td>{q.sendRST}</td>
        <td>{q.rcvdRST}</td>
      </tr>
      )}
    </tbody>
  </>
  )
}

const Input = (() => {
  const timeform = useRef<HTMLInputElement>(null);
  const callsignform = useRef<HTMLInputElement>(null);
  const sendRSTform = useRef<HTMLInputElement>(null);
  const rcvdRSTform = useRef<HTMLInputElement>(null);



  const [inputqso, setInputQSO] = useState<QSO>(
    { time : new Date(), callSign : "", sendRST : "", rcvdRST : ""}
  )
  const [qsos, setQSOs] = useState<QSO[]>([]);
  useEffect(() => {
    setInterval(() => setInputQSO({ ...inputqso, time: new Date() }), 10000);
  }, []);

  const keyDownAction = 
    (refObj: React.RefObject<HTMLInputElement>) =>
      (e: React.KeyboardEvent<HTMLInputElement>) =>
        {
          if(e.key === 'Enter') {
            refObj.current?.focus()
          }
        }
        
  return (
    <div>
      <table id="apptable">
      <Table qs={qsos}/>
      <tfoot id="input">
        <tr>
          <td>
            <input
              ref={timeform}
              value={createTimeStr(inputqso.time)}
              onKeyDown={keyDownAction(callsignform)}
            />
          </td>
          <td>
            <input
              ref={callsignform}
              value={inputqso.callSign}
              onChange={
                e => setInputQSO({...inputqso, callSign: e.target.value})
              }
              onKeyDown={keyDownAction(sendRSTform)}
            />
          </td>
          <td>
            <input
              ref={sendRSTform}
              value={inputqso.sendRST}
              onChange={
                e => setInputQSO({...inputqso, sendRST: e.target.value})
              }
              onKeyDown={keyDownAction(rcvdRSTform)}
            />
          </td>
          <td>
            <input
              ref={rcvdRSTform}
              value={inputqso.rcvdRST}
              onChange={
                e => setInputQSO({...inputqso, rcvdRST: e.target.value})
              }
              onKeyDown={
                e => {
                  if(e.key === 'Enter'){
                    keyDownAction(callsignform);
                    setQSOs([...qsos,inputqso]);
                    setInputQSO(
                      {
                        time : new Date(),
                        callSign : "",
                        sendRST : "",
                        rcvdRST : ""
                      }
                    )
                  }
                }
              }
            />
          </td>
        </tr>
      </tfoot>
      </table>
    </div>
  )
});

function App() {
  return (
    <div className="App">
      <Input />
    </div>
  );
}

export default App;
