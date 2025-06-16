import Image from "next/image";
import Link from "next/link";

const members = [
	{
		name: "Dominic",
		title: "Entwicklerfuchs",
		image: "dominic.jpg",
		social: {
			url: "https://social.linux.pizza/@dominicwrege",
			text: "@dominicwrege",
		},
	},
	{
		name: "Malik",
		title: "Designfuchs",
		image: "malik.jpg",
		social: {
			url: "https://mastodon.social/@Malik",
			text: "@Malik@mastodon.social",
		},
	},
	{
		name: "Sven",
		title: "Moderatorfuchs",
		image: "sven.jpg",
		social: {
			url: "https://chaos.social/@svenraskin",
			text: "@svenraskin@chaos.social",
		},
	},
	{
		name: "Kay",
		title: "Veteranfuchs",
		image: "kay.jpg",
		social: {
			url: "https://4lau.bsky.social",
			text: "Bluesky",
		},
	},
];

export default function Team() {
	return (
		<ul className="space-y-4">
			{members.map((member) => {
				return (
					<li className="flex gap-4 items-center" key={member.name}>
						<Image
							className="rounded-full aspect-square object-cover"
							src={`/team/${member.image}`}
							height={100}
							width={100}
							alt={`Profilbild von ${member.image}`}
						/>
						<div>
							<div className="font-lg uppercase font-bold">
								{member.name}
							</div>
							<div className="italic">{member.title}</div>
							{member.social && (
								<Link
									href={member.social.url}
									prefetch={false}
									target="_blank"
									className="italic"
								>
									{member.social.text}
								</Link>
							)}
						</div>
					</li>
				);
			})}
		</ul>
	);
}
