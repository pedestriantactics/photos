export function getInitialsFromName(stringName?: string) {
		if (!stringName || !stringName.trim()) {
			return "";
		}

		const loggedInUserInitials = stringName
			.split(" ")
			.filter((part: string) => part.length > 0)
			.map((part: string) => part[0].toUpperCase())
			.join("");

		if (loggedInUserInitials.length <= 1) {
			return loggedInUserInitials;
		}

		return (
			loggedInUserInitials[0] +
			loggedInUserInitials[loggedInUserInitials.length - 1]
		);
	}