import { Spinner as FlowbiteSpinner } from 'flowbite-react'

const Spinner = () => {
  return (
    <div>
      <FlowbiteSpinner color="purple" aria-label="Loading spinner" />
      <span className="text-white ml-5">Loading...</span>
    </div>
  )
}

export default Spinner
