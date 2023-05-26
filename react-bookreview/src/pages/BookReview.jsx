import React, { useEffect, useState } from 'react'
import { addDoc, collection, doc, getDocs, updateDoc, Timestamp, deleteDoc, where, query } from "firebase/firestore";

import { db } from '../database/firestore'

export default function BookReview() {

  // 파이어 베이스에서 가져온 값 출력
  const [books, setBooks] = useState();

  // 가져올 값을 개별 state로 가져오기
  const [title, setTitle] = useState();
  const [author, setAuthor] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  // 검색할 title 값 state
  const [searchTitle, setSearchTitle] = useState();

  // 검색된 값 state
  const [searchTitleResult, setSearchTitleResult] = useState();

  // 시작하자마자 값 가져오기
  useEffect(()=>{
    getData();
  },[startDate, endDate])

  // 비동기 함수로 작성하여 값 가져오기
  async function getData() {
    // getDocs : 컬렉션 안의 모든 문서 가져옴
    const querySnapshot = await getDocs(collection(db, "readingbooks"));
    // 빈 배열 생성
    const dataArray = [];
    // forEach : 모든 문서값에 접근하여 원하는 값 가져옴
    querySnapshot.forEach((doc) => {
      dataArray.push(
        {
          id: doc.id,
          ...doc.data()
        }
      );
      console.log(doc.data());
    });
    setBooks(dataArray);
}

// 책 추가 메소드
const onAddBook = async (e) => {  
  e.preventDefault();
  try {
      // 서버에 연결해서 사용하는 것은 비동기 함수로 작성
      const docRef = await addDoc(collection(db, "readingbooks"), {
        // first: "Ada",
        // last: "Lovelace",
        // born: 1815
        title: title,
        author: author,
        done : false,
        startDate : Timestamp.fromDate(new Date()),
        endDate : null,
        memo : null
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    // 버튼 클릭하면 출력됨
    getData();
}

// 목록에서 삭제 메소드
const onDeleteBook = async (id) => {
  if (window.confirm('정말로 삭제하시겠습니까?')) {
    await deleteDoc(doc(db,"readingbooks", id));
    getData();
  }
}

// 감상문 작성 메소드
const onWriteMemo = async (id) => {
  const memoPrompt = prompt("감상문 작성", "")
  if (memoPrompt) {
    await updateDoc(doc(db, "readingbooks", id), {
      memo: memoPrompt,
      endDate: Timestamp.fromDate(new Date())
    });
  }
  getData();
}

// 책 검색 메소드
const onSearch = async (e) => {
  e.preventDefault();
  const q = query(collection(db, "readingbooks"),
    where("title", "==", searchTitle)
  );
  const querySnapshop = await getDocs(q);
  let dataArray = [];
  querySnapshop.forEach((doc) => {
    dataArray.push({
      id: doc.id,
      ...doc.data()
    })
    console.log(dataArray)
  })
  setSearchTitleResult(dataArray.length > 0 ? dataArray : null);
}

  return (
    <div>

      <h1>BookReview</h1>
      <h3>redingbooks 컬렉션</h3>
      <hr />

      <div>
        <h4>책 추가</h4>
        <form action=""
          onSubmit={ onAddBook }
        >
          <label htmlFor="">제목</label>
          <input 
            type="text" 
            onChange={(e)=>{setTitle(e.target.value)}}
          />
          <br />
          <label htmlFor="">저자</label>
          <input 
            type="text" 
            onChange={(e)=>{setAuthor(e.target.value)}}
          />
          <br />
          <input type="submit" value="추가"/>
        </form>
        <br />
      </div>
      <hr />

      <div>
        <h4>읽은 책 검색하기</h4>
        <form action="" onSubmit={ onSearch }>
          <input 
            type="text" 
            onChange={(e)=>{setSearchTitle(e.target.value)}}
          />
          <input type="submit" value="검색"/>
        </form>
      </div>

      {
        !searchTitleResult ? null : (
          <div>
          <h4>검색 결과 목록</h4>
          {
            searchTitleResult.map((result)=>(
              <div key={result.id}>
                <span><b>
                  {(() => {
                    const convertStartMonth = result.startDate.toDate().getMonth() + 1;
                    const convertStartDate = result.startDate.toDate().getDate();
                    return `${convertStartMonth}월 ${convertStartDate}일`;
                  })()} 
                  ~ 
                  {result.endDate === undefined || result.endDate === null ? "" : (()=>{
                    const convertEndMonth = result.endDate.toDate().getMonth()+1;
                    const convertEndDate = result.endDate.toDate().getDate();
                    return `${convertEndMonth}월 ${convertEndDate}일`;
                  })()}
                </b></span>
                <span><b>
                  {
                    result.done? "" : "읽는 중"
                  }
                </b></span>
                <h4>제목 : {result.title}</h4>
                <p>저자 : {result.author}</p>
                {
                  result.memo
                  ? (<p>감상문 : {result.memo}</p>)
                  : "없음"
                }
              </div>
            ))
          }
        </div>
        ) 
      }
      <br />
      <hr />
      
      <div>
        <h4>목록</h4>
        {
          books && books.map((book)=>(
            <div key={book.id} style={{backgroundColor: "lightgrey", marginBottom: "10px"}}>
              <span><b>
                {(() => {
                  const convertStartMonth = book.startDate.toDate().getMonth() + 1;
                  const convertStartDate = book.startDate.toDate().getDate();
                  return `${convertStartMonth}월 ${convertStartDate}일`;
                })()} 
                ~ 
                {book.endDate === undefined || book.endDate === null ? "" : (()=>{
                  const convertEndMonth = book.endDate.toDate().getMonth()+1;
                  const convertEndDate = book.endDate.toDate().getDate();
                  return `${convertEndMonth}월 ${convertEndDate}일`;
                })()}
              </b></span>
              <span><b>
                {
                  book.done ? "" : "읽는 중"
                }
              </b></span>
              <h4>제목 : {book.title}</h4>
              <p>저자 : {book.author}</p>
              {
                book.memo 
                ? (<p>감상문 : {book.memo}</p>)
                : (<button onClick={ ()=>{onWriteMemo(book.id)} }>감상문 작성</button>)
              }
              <button
                onClick={ ()=>{onDeleteBook(book.id)} }
              >
                X
              </button>
            </div>
          ))
        }
      </div>

    </div>
  )
}
