import Navbar from '../components/Navbar'

const UserLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
        <Navbar />
        <div className="py-8">
        {children}
        </div>
    </>
  )
}

export default UserLayout