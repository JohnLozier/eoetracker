const NotFound = () => {
	return <div className="w-screen h-screen flex items-center justify-center sm:justify-start">
		<div className="sm:ml-10 ml-0 flex flex-col gap-y-3 sm:items-start items-center">
			<h1 className="text-9xl font-bold text-zinc-600 font-montserrat">404</h1>
			<p className="text-zinc-600/80 font-mona font-semibold text-md">Sorry, the page you are looking for does not exist.</p>
		</div>
	</div>;
};

export default NotFound;