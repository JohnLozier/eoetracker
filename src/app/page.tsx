"use client";

import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import Analytics from "~/components/analytics";
import Record from "~/components/record";
import { hasUserSubmitted } from "~/lib/actions";

const Index = () => {
	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		(async () => {
			const { successful, result } = await hasUserSubmitted();

			if (successful) {
				setShowPopup(!result);
			}
		})();
	}, []);

	return <div className="bg-white w-screen h-screen overflow-hidden">
		<SignedIn treatPendingAsSignedOut={false}>
			<Record showPopup={showPopup} setShowPopup={setShowPopup} />
			<Analytics showPopup={showPopup} setShowPopup={setShowPopup} />
		</SignedIn>
		<SignedOut treatPendingAsSignedOut={false}>
			<RedirectToSignIn />
		</SignedOut>
	</div>;
};

export default Index;