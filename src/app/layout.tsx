import "../styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import { SpeedInsights } from "@vercel/speed-insights/next"

const Layout = ({ children }: {
	children: React.ReactNode
}) => {
	return <html>
		<body className="overflow-hidden">
			<SpeedInsights />
			<Analytics />
			<ClerkProvider appearance={ {
				theme: "simple"
			} }>
				{ children }
			</ClerkProvider>
		</body>
	</html>;
};

export default Layout;