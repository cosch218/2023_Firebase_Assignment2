import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginComp() {
  const navigate = useNavigate();
  const onLogin = (e) => {
    e.preventDefault();
    navigate('/bookreview')
  }
  return (
    <div>
      <form action="" onSubmit={ onLogin }>
        <label htmlFor="">아이디</label>
        <input type="text" />
        <br />
        <label htmlFor="">패스워드</label>
        <input type="password" />
        <br />
        <input type="submit" value="로그인"/>
      </form>
    </div>
  )
}
