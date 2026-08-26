const Header = ({name}) => <h2>{name}</h2>

const Content = ({parts}) => parts.map(part => <Part key={part.id} part={part}/>)

const Part = ({part}) => {
  const { name, exercises } = part

  return <p>{name} {exercises}</p>
}

const Total = ({parts}) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <h4>total of {total} exercises</h4>
  )
}

const Course = ({course}) => {
  return (
    <>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </>
  )
}

export default Course