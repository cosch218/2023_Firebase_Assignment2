import React from 'react'
import LoginComp from '../components/LoginComp'

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>책 리뷰 서비스를 이용하시려면 로그인이 필요합니다</p>
      <LoginComp/>
    </div>
  )
}
