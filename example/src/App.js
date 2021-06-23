import React, {useState} from 'react'
import {Router, useIndex, useShow, useUpdate, useRecords} from 'ra-fetch'

Router.baseURL('https://jsonplaceholder.typicode.com')
  .index('todos', '/todos')
  .show('todo', '/todos/{id}')
  .store('todo', '/todos', {form_data: true})
  .update('todo', '/todos/{id}')

export default function App() {
  const [todosParams, setTodosParams] = useState({userId: 1})
  const [todos, setTodos] = useIndex('todos', todosParams, true)
  const [todo] = useShow('todo', {id: 1})
  const [storeTodo, setStoreTodo, submitStoreTodo] = useRecords(setTodos, todos.data)
    .bearerToken('test')
    .store('todo', {
      title: '',
      completed: false,
      thumbnail: null
    })

  const [updateTodo, setUpdateTodo, submitUpdateTodo] = useUpdate('todo', {
    title: '',
    completed: false,
  }, {id: 1})

  console.log(todos)

  return <div>
    <button onClick={() => setTodosParams({userId: 2})}>todos users 2</button>
    <p><strong>Todo with ID 1: {todo.data.title}</strong></p>
    <p>Loading todo: {todo.loading ? 'true ' : 'false'}</p>

    <p><strong>{todo.id ? 'Edit' : 'Create'} Todo:</strong></p>
    <form onSubmit={(event) => {
      event.preventDefault()
      submitStoreTodo().then(response => {
        console.log(response)
      })
    }}>
      <div>
        <label htmlFor={'title'}>Title</label>

        <input
          type={'text'}
          name={'title'}
          id={'title'}
          onChange={(value) => setStoreTodo({title: value.target.value})}
          value={storeTodo.data.title}
        />
      </div>

      <div>
        <label htmlFor={'completed'}>Completed</label>

        <input
          type={'checkbox'}
          name={'completed'}
          id={'completed'}
          onChange={(value) => setStoreTodo({completed: value.target.checked})}
          value={storeTodo.data.completed}
        />
      </div>
      <div>
        <input type="file" onChange={event => setStoreTodo({thumbnail: event.target.files[0]})}/>
      </div>
      <div>
        <input type={'submit'} name={'submit'} value={todo.id ? 'edit' : 'create'}/>
      </div>
    </form>

    <p><strong>Todos:</strong></p>
    <p>Loading todos: {todos.loading ? 'true ' : 'false'}</p>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th style={{textAlign: 'left'}} colSpan={2}>Title</th>
      </tr>
      </thead>
      <tbody>
      {
        todos.data.map((item, index) => <tr key={index}>
            <td>{item.id}</td>
            <td>{item.title || 'unknown'}</td>
            <td>
              <button onClick={() => setStoreTodo(item)}>edit</button>
            </td>
            <td>
              <button onClick={() => {
                // TODO delete todo
              }}>delete
              </button>
            </td>
          </tr>,
        )
      }
      </tbody>
    </table>
    <button onClick={() => {
      // TODO load more todos
    }}>load more
    </button>
  </div>
}
