import React, { useEffect, useState } from 'react'


// 파이어 스토어
import { collection, Timestamp, getDocs, deleteDoc, doc, updateDoc, where, query } from "firebase/firestore";
import { db } from '../database/firebase'
import AddBookBox from './AddBookBox';


export default function BookComp() {
  
  // return으로 출력될 전체 책 리스트
  const [books, setBooks] = useState();

  // 검색하기 위한 값
  const [searchTitle, setSearchTitle] = useState("");

  // 검색결과를 위한 값
  const [searchResult, setSearchResult] = useState();

  // 책 목록을 가져오는 메소드
  const getBook = async() => {
    const querySnapshot = await getDocs(collection(db, "readingbooks"));
    let array = [];
    querySnapshot.forEach((doc)=>{
      array.push({
        id: doc.id,
        ...doc.data()
      });
      console.log(`${doc.id} => ${doc.data()}`)
      // dir을 통해 doc.data()객체 확인
      // >> timestamp는 todate를 통해 Date객체로 변환해서 사용
      console.dir(doc.data().startDate.toDate());
    });
    setBooks(array);
  }

  // 책을 삭제하는 메소드
  const deleteBook = async(id) => {
    await deleteDoc(doc(db, "readingbooks", id));
    // 수정된 값 화면에 출력
    getBook()
  }

  // 감상문을 추가하고 책의 값을 수정하는 메소드
  const updateBook = async(id) => {
    const memo = prompt("느낀점을 입력하세요");
    // memo의 값이 없을 때 return을 실행하여 메소드 종료
    if (!memo)
      return ;
    // memo의 값이 있다면 아래 코드 실행
    const updateRef = doc(db, "readingbooks", id);
    await updateDoc(updateRef, {
      memo: memo,
      done: true,
      endDate: Timestamp.fromDate(new Date())
    })
    // 수정된 값 화면에 출력
    getBook();
  }
  
  // 책을 검색하는 메소드
  const searchBook = async(e) => {
    e.preventDefault();
    const q = query(collection(db, "readingbooks"), where("title", "==", searchTitle));
    // 배열에 담아서 사용
    const querySnapshot = await getDocs(q);
    let array = [];
    querySnapshot.forEach((doc) => {
      array.push(
        {
          id: doc.id,
          ...doc.data()
        }
      )
      console.log(doc.id, " => ", doc.data());
    });
    // 찾은 정보값 화면에 출력
    setSearchResult(array);
  }

  // 현재 컴포넌트가 실행됐을 때 추가된 목록 바로 출력
  useEffect(()=>{
    getBook();
  },[])

  // return 화면에 값을 출력하기 위한 함수
  // 타임스탬프 값을 넣으면 값을 변환해서 문자열로 반환하는 함수 작성
  const printTime = (date) => {
    const month = date.toDate().getMonth()+1;
    const day = date.toDate().getDate()+1;
    return `${month}월 ${day}일`;
  }

  return (
    <div>
      <h3>readingbooks 컬렉션</h3>
      <h3> 책 추가</h3>
      <AddBookBox getBook={getBook}/>
      <hr />
      <form onSubmit={searchBook}>
        <input type="text" onChange={(e)=>{setSearchTitle(e.target.value)}}/>
        <button type='submit'>읽은 책 검색하기</button>
      </form>
      <hr />
      {
        searchResult && searchResult.map((book)=>(
          <div>
            <h4>{printTime(book.startDate)} {book.title}</h4>
            {
              book.memo
              ? (<p>{book.memo}</p>)
              : (<p>메모없음</p>)
            }
          </div>
        ))
      }
      <hr />
      {
        // 외부에서 값을 가져오는 시간이 걸리기 때문에 값이 없다면 book.map()을 실행하는 데 오류가 생기기 때문에 비교연산자를 먼저 실행
        books && books.map((book)=>(
          <div key={book.id0}>
            <h4>
              {printTime(book.startDate)} ~ {book.done ? printTime(book.endDate) : "읽는중"}
              {' '}{book.title}
            </h4>
            {
              book.done
              ? (<p>{book.memo}</p>)
              : (<button onClick={()=>{updateBook(book.id)}}>감상문 작성</button>)
            }
            <button onClick={()=>{deleteBook(book.id)}}>X</button>
          </div>
        ))
      }
    </div>
  )
}