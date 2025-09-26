import { SignIn } from "@clerk/nextjs";

const Page = () => {
	return <div className="items-center h-screen w-screen justify-center flex">
		<SignIn appearance={ {
			variables: {
				fontFamily: "Mona-Sans"
			}
		} } />
	</div>;
};

export default Page;