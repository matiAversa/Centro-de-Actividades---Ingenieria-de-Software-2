import React from "react";
import "../styles/spinner.css";

type Props = {
	size?: number;
	message?: string;
	centered?: boolean;
};

const Spinner: React.FC<Props> = ({ size = 48, message, centered = true }) => {
	const wrapClass = centered ? "spinner-wrap centered" : "spinner-wrap";

	return (
		<div className={wrapClass} aria-live="polite" aria-busy="true">
			<div
				className="spinner"
				style={{ width: size, height: size }}
				role="img"
				aria-label={message ? message : "Cargando"}
			/>
			{message && <div className="spinner-message">{message}</div>}
		</div>
	);
};

export default Spinner;
