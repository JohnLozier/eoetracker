"use client"

import React, { useState } from "react"
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";

import Analytics from "~/components/analytics";
import Record from "~/components/record"

const Index = () => {
	const [ showPopup, setShowPopup ] = useState(true);

	return <div className="bg-white w-screen h-screen overflow-hidden">
		<SignedIn treatPendingAsSignedOut={ false }>
			<Record showPopup={ showPopup } setShowPopup={ setShowPopup } />
			<Analytics showPopup={ showPopup } setShowPopup={ setShowPopup } />
		</SignedIn>
		<SignedOut treatPendingAsSignedOut={ false }>
			<RedirectToSignIn />
		</SignedOut>
	</div>;
};

export default Index;