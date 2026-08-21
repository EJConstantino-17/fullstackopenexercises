const Header = ({course}) => <h1>{course.name}</h1>

const Content = ({course}) => {
  const [first, second, third] = course.parts

  return (
    <>
      <Part part={first} />
      <Part part={second} />
      <Part part={third} />
    </>
  )
}

const Part = ({part}) => {
  const { name, exercises } = part

  return <p>{name} {exercises}</p>
}

const Total = ({course}) => {
  const total = course.parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <p>Number of exercises {total}</p>
  )
}

const Course = ({course}) => {
  return (
    <>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </>
  )
}

const App = () => {
  const course = {
      name: 'Half Stack application development',
      parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10},
      {
        name: 'Using props to pass data',
        exercises: 7},
      {
        name: 'State of a component',
        exercises: 14
      },
    ]
  }
  return (
    <div>
      <Course course={course} />
    </div>
  )
}

export default App