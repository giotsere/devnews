import Login from './Login';
import SignUp from './SignUp';

function LoginPage() {
  return (
    <>
      <div className="flex flex-col items-center pb-12">
        <Login />
        <SignUp />
      </div>
    </>
  );
}

export default Loginpage;
