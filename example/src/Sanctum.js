import React, {useState} from 'react'
import {Router, useLogin, useShow, useStore, useUpdate, useLogout, useIndex, useDelete, useBearerToken} from 'ra-fetch'

Router.baseURL('http://localhost:8000')
  .csrfURL('/sanctum/csrf-cookie')
  .loginURL('/login')
  .logoutURL('/logout')
  // Category routes
  .index('categories', '/api/categories')
  .show('category', '/api/categories/{id}')
  .store('category', '/api/categories')
  .update('category', '/api/categories/{id}')
  .delete('category', '/api/categories/{id}')
  // User routes
  .show('user', '/api/user')

function StoreCategory({categories, setCategories}) {
  const [category, setCategory, submitCategory] = useStore('category', {
    name: '',
    label: '',
  }, categories.data)

  return <SaveCategory
    category={category}
    setCategory={setCategory}
    submitCategory={submitCategory}
    setCategories={setCategories}/>
}

function UpdateCategory({id, categories, setCategories}) {
  const [category, setCategory, submitCategory] = useUpdate('category', {id}, {
      id: id,
      name: '',
      label: '',
    }, categories.data)

  return <SaveCategory
    category={category}
    setCategory={setCategory}
    submitCategory={submitCategory}
    setCategories={setCategories}/>
}

function SaveCategory({category, setCategory, submitCategory, setCategories}) {
  return <form onSubmit={(event) => {
    event.preventDefault()
    submitCategory().then(response => setCategories(response.data))
  }}>
    <div>
      <h1>Store category</h1>
      <label htmlFor={'name'}>name</label>

      <input
        type={'text'}
        name={'name'}
        id={'name'}
        onChange={(value) => setCategory({name: value.target.value})}
        value={category.data.name}
      />
    </div>

    <div>
      <label htmlFor={'name'}>label</label>

      <input
        type={'text'}
        name={'label'}
        id={'label'}
        onChange={(value) => setCategory({label: value.target.value})}
        value={category.data.label}
      />
    </div>


    <div>
      <input type={'submit'} name={'submit'} value={'store'}/>
    </div>
  </form>
}

function UserLogin() {
  const [login, setLogin, submitLogin] = useLogin({
    email: '',
    password: '',
  })

  return <form onSubmit={(event) => {
    event.preventDefault()
    submitLogin().then(response => {
      window.location.reload()
    })
  }}>
    <div>
      <h1>User login</h1>
      <label htmlFor={'name'}>email</label>

      <input
        type={'text'}
        name={'email'}
        id={'email'}
        onChange={(value) => setLogin({email: value.target.value})}
        value={login.data.name}
      />
    </div>

    <div>
      <label htmlFor={'name'}>password</label>

      <input
        type={'password'}
        name={'password'}
        id={'password'}
        onChange={(value) => setLogin({password: value.target.value})}
        value={login.data.password}
      />
    </div>


    <div>
      <input type={'submit'} name={'submit'} value={'store'}/>
    </div>
  </form>
}

function UserLogout() {
  const [logout, setLogout, submitLogout] = useLogout()

  return <button onClick={() => {
    submitLogout().then(response => {
      window.location.reload()
    })
  }}>logout</button>
}

function Categories({categories, setCategory, setCategories}) {
  const [destroy, submitDestroy] = useDelete('category', {}, categories.data)

  return <div>
    <ul style={{
      maxHeight: '150px',
      overflowY: 'scroll',
    }}>
      {
        categories.data.map((category, index) => <li key={index}>
          {category.name}
          <button onClick={() => setCategory(category)}>edit</button>
          <button disabled={destroy.loading} onClick={() => {
            submitDestroy({id: category.id})
              .then(response => setCategories(response.data))
          }}>delete</button>
        </li>)
      }
    </ul>
  </div>
}

function App() {
  const [user] = useShow('user')
  // const [user] = useBearerToken('').show('user')
  const [categories, setCategories] = useIndex('categories')
  const [category, setCategory] = useState({})

  if (user.data.id) {
    return <div>
      <h1>User: {user.data.email}</h1>
      <UserLogout/>
      {
        category.id ? <UpdateCategory
          id={category.id}
          categories={categories}
          setCategories={setCategories}
        /> : <StoreCategory
          categories={categories}
          setCategories={setCategories}
        />
      }
      <Categories categories={categories} setCategory={setCategory} setCategories={setCategories}/>
    </div>
  }
  return <div>
    <UserLogin/>
  </div>
}

export default App
