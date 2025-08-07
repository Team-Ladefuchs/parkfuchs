import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faCreativeCommons } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { style } from "../../styles/Impressum.Module";
import Team from "../../components/Team";

export default function Impressum() {
	return (
		<>
			<style>{style}</style>
			<div className="impressum mx-auto pb-20 max-w-xl max-md:mx-4 overflow-x-none">
				<div className="flex mb-8">
					<Link className="flex gap-3 items-center" href="/">
						<FontAwesomeIcon
							icon={faArrowLeft}
							className="w-5 h-5"
						/>
						<div>zurück</div>
					</Link>
				</div>
				<h1 className="text-3xl mb-6">Das Team</h1>
				<Team />
				<h1 className="text-3xl mt-10">Datenschutzerklärung</h1>
				<section className="mt-6">
					<h2 id="m14" className="text-2xl mb-2">
						Einleitung
					</h2>
					<p>
						Mit der folgenden Datenschutzerklärung möchten wir Sie
						darüber aufklären, welche Arten Ihrer personenbezogenen
						Daten (nachfolgend auch kurz als &#34;Daten&#34;
						bezeichnet) wir zu welchen Zwecken und in welchem Umfang
						verarbeiten. Die Datenschutzerklärung gilt für alle von
						uns durchgeführten Verarbeitungen personenbezogener
						Daten, sowohl im Rahmen der Erbringung unserer
						Leistungen als auch insbesondere auf unseren Webseiten,
						in mobilen Applikationen sowie innerhalb externer
						Onlinepräsenzen, wie z.B. unserer Social-Media-Profile
						(nachfolgend zusammenfassend bezeichnet als
						&#34;Onlineangebot&#34;).
					</p>
				</section>
				<section className="mt-6">
					<p>
						Die verwendeten Begriffe sind nicht
						geschlechtsspezifisch.
					</p>
					<p>Stand: 7. Dezember 2022</p>
					<h2 className="font-xl mt-6">Inhaltsübersicht</h2>
					<ul className="list-disc ml-6">
						<li>
							<Link
								className="index-link"
								href="#m14"
								prefetch={false}
							>
								Einleitung
							</Link>
						</li>
						<li>
							<Link
								className="index-link"
								href="#m3"
								prefetch={false}
							>
								Verantwortlicher
							</Link>
						</li>
						<li>
							<Link
								className="index-link"
								href="#mOverview"
								prefetch={false}
							>
								Übersicht der Verarbeitungen
							</Link>
						</li>
						<li>
							<Link
								className="index-link"
								href="#m13"
								prefetch={false}
							>
								Maßgebliche Rechtsgrundlagen
							</Link>
						</li>
						<li>
							<Link
								className="index-link"
								href="#m27"
								prefetch={false}
							>
								Sicherheitsmaßnahmen
							</Link>
						</li>
						<li>
							<Link
								className="index-link"
								href="#m25"
								prefetch={false}
							>
								Übermittlung von personenbezogenen Daten
							</Link>
						</li>
						<li>
							<Link
								className="index-link"
								href="#m24"
								prefetch={false}
							>
								Datenverarbeitung in Drittländern
							</Link>
						</li>
						<li>
							<Link
								className="index-link"
								href="#m12"
								prefetch={false}
							>
								Löschung von Daten
							</Link>
						</li>
						<li>
							<Link
								className="index-link"
								href="#m225"
								prefetch={false}
							>
								Bereitstellung des Onlineangebotes und
								Webhosting
							</Link>
						</li>
						<li>
							<Link
								prefetch={false}
								className="index-link"
								href="#m182"
							>
								Kontakt- und Anfragenverwaltung
							</Link>
						</li>
						<li>
							<Link
								prefetch={false}
								className="index-link"
								href="#m136"
							>
								Präsenzen in sozialen Netzwerken (Social Media)
							</Link>
						</li>
						<li>
							<Link
								prefetch={false}
								className="index-link"
								href="#m328"
							>
								Plugins und eingebettete Funktionen sowie
								Inhalte
							</Link>
						</li>
						<li>
							<Link
								prefetch={false}
								className="index-link"
								href="#m15"
							>
								Änderung und Aktualisierung der
								Datenschutzerklärung
							</Link>
						</li>
						<li>
							<Link
								prefetch={false}
								className="index-link"
								href="#m10"
							>
								Rechte der betroffenen Personen
							</Link>
						</li>
						<li>
							<Link
								prefetch={false}
								className="index-link"
								href="#m42"
							>
								Begriffsdefinitionen
							</Link>
						</li>
					</ul>
				</section>

				<section className="mt-6">
					<h2 id="m3" className="font-bold mb-2">
						Verantwortlicher
					</h2>
					<address className="font-normal!">
						Malik Aziz<br></br>
						Stephanstraße 43-45<br></br>
						52064 Aachen
					</address>
					<div className="mt-1">
						<p>pE-Mail-Adresse:</p>
						<p className="mb-1">
							<Link href="mailto:malik@ladefuchs.app">
								malik@ladefuchs.app
							</Link>
						</p>
					</div>
					Impressum:{" "}
					<div>
						<Link
							href="https://parkfuchs.app/impressum"
							target="_blank"
							className="underline"
						>
							https://parkfuchs.app/impressum
						</Link>
					</div>
				</section>
				<section className="mt-6">
					<h2 id="mOverview" className="text-xl">
						Übersicht der Verarbeitungen
					</h2>
					<p>
						Die nachfolgende Übersicht fasst die Arten der
						verarbeiteten Daten und die Zwecke ihrer Verarbeitung
						zusammen und verweist auf die betroffenen Personen.
					</p>
				</section>
				<section className="mt-6">
					<h3>Arten der verarbeiteten Daten</h3>
					<ul className="list-disc ml-6">
						<li>Kontaktdaten.</li>
						<li>Inhaltsdaten.</li>
						<li>Nutzungsdaten.</li>
						<li>Meta-/Kommunikationsdaten.</li>
					</ul>
					<h3>Kategorien betroffener Personen</h3>
					<ul className="list-disc ml-6">
						<li>Kommunikationspartner.</li>
						<li>Nutzer.</li>
					</ul>
				</section>
				<section className="mt-6">
					<h3>Zwecke der Verarbeitung</h3>
					<ul className="list-disc ml-6 mb-6">
						<li>Kontaktanfragen und Kommunikation.</li>
						<li>Sicherheitsmaßnahmen.</li>
						<li>Verwaltung und Beantwortung von Anfragen.</li>
						<li>Feedback.</li>
						<li>Marketing.</li>
						<li>
							Bereitstellung unseres Onlineangebotes und
							Nutzerfreundlichkeit.
						</li>
						<li>Informationstechnische Infrastruktur.</li>
					</ul>
				</section>
				<section className="mt-6">
					<h3 id="m13">Maßgebliche Rechtsgrundlagen</h3>
					<p>
						Im Folgenden erhalten Sie eine Übersicht der
						Rechtsgrundlagen der DSGVO, auf deren Basis wir
						personenbezogene Daten verarbeiten. Bitte nehmen Sie zur
						Kenntnis, dass neben den Regelungen der DSGVO nationale
						Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder
						Sitzland gelten können. Sollten ferner im Einzelfall
						speziellere Rechtsgrundlagen maßgeblich sein, teilen wir
						Ihnen diese in der Datenschutzerklärung mit.
					</p>
					<ul className="list-disc ml-6 mb-6">
						<li>
							<strong>
								Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit.
								f) DSGVO)
							</strong>{" "}
							- Die Verarbeitung ist zur Wahrung der berechtigten
							Interessen des Verantwortlichen oder eines Dritten
							erforderlich, sofern nicht die Interessen oder
							Grundrechte und Grundfreiheiten der betroffenen
							Person, die den Schutz personenbezogener Daten
							erfordern, überwiegen.
						</li>
					</ul>
					<p>
						Zusätzlich zu den Datenschutzregelungen der
						Datenschutz-Grundverordnung gelten nationale Regelungen
						zum Datenschutz in Deutschland. Hierzu gehört
						insbesondere das Gesetz zum Schutz vor Missbrauch
						personenbezogener Daten bei der Datenverarbeitung
						(Bundesdatenschutzgesetz – BDSG). Das BDSG enthält
						insbesondere Spezialregelungen zum Recht auf Auskunft,
						zum Recht auf Löschung, zum Widerspruchsrecht, zur
						Verarbeitung besonderer Kategorien personenbezogener
						Daten, zur Verarbeitung für andere Zwecke und zur
						Übermittlung sowie automatisierten Entscheidungsfindung
						im Einzelfall einschließlich Profiling. Des Weiteren
						regelt es die Datenverarbeitung für Zwecke des
						Beschäftigungsverhältnisses (§ 26 BDSG), insbesondere im
						Hinblick auf die Begründung, Durchführung oder
						Beendigung von Beschäftigungsverhältnissen sowie die
						Einwilligung von Beschäftigten. Ferner können
						Landesdatenschutzgesetze der einzelnen Bundesländer zur
						Anwendung gelangen.
					</p>
					<h2 id="m27">Sicherheitsmaßnahmen</h2>
					<p>
						Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter
						Berücksichtigung des Stands der Technik, der
						Implementierungskosten und der Art, des Umfangs, der
						Umstände und der Zwecke der Verarbeitung sowie der
						unterschiedlichen Eintrittswahrscheinlichkeiten und des
						Ausmaßes der Bedrohung der Rechte und Freiheiten
						natürlicher Personen geeignete technische und
						organisatorische Maßnahmen, um ein dem Risiko
						angemessenes Schutzniveau zu gewährleisten.
					</p>
					<p>
						Zu den Maßnahmen gehören insbesondere die Sicherung der
						Vertraulichkeit, Integrität und Verfügbarkeit von Daten
						durch Kontrolle des physischen und elektronischen
						Zugangs zu den Daten als auch des sie betreffenden
						Zugriffs, der Eingabe, der Weitergabe, der Sicherung der
						Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir
						Verfahren eingerichtet, die eine Wahrnehmung von
						Betroffenenrechten, die Löschung von Daten und
						Reaktionen auf die Gefährdung der Daten gewährleisten.
						Ferner berücksichtigen wir den Schutz personenbezogener
						Daten bereits bei der Entwicklung bzw. Auswahl von
						Hardware, Software sowie Verfahren entsprechend dem
						Prinzip des Datenschutzes, durch Technikgestaltung und
						durch datenschutzfreundliche Voreinstellungen.
					</p>
					<p>
						TLS-Verschlüsselung (https): Um Ihre via unserem
						Online-Angebot übermittelten Daten zu schützen, nutzen
						wir eine TLS-Verschlüsselung. Sie erkennen derart
						verschlüsselte Verbindungen an dem Präfix https:// in
						der Adresszeile Ihres Browsers.
					</p>
				</section>

				<section>
					<h2 id="m25">Übermittlung von personenbezogenen Daten</h2>
					<p>
						Im Rahmen unserer Verarbeitung von personenbezogenen
						Daten kommt es vor, dass die Daten an andere Stellen,
						Unternehmen, rechtlich selbstständige
						Organisationseinheiten oder Personen übermittelt oder
						sie ihnen gegenüber offengelegt werden. Zu den
						Empfängern dieser Daten können z.B. mit IT-Aufgaben
						beauftragte Dienstleister oder Anbieter von Diensten und
						Inhalten, die in eine Webseite eingebunden werden,
						gehören. In solchen Fall beachten wir die gesetzlichen
						Vorgaben und schließen insbesondere entsprechende
						Verträge bzw. Vereinbarungen, die dem Schutz Ihrer Daten
						dienen, mit den Empfängern Ihrer Daten ab.
					</p>
					<h2 id="m24">Datenverarbeitung in Drittländern</h2>
					<p>
						Sofern wir Daten in einem Drittland (d.h., außerhalb der
						Europäischen Union (EU), des Europäischen
						Wirtschaftsraums (EWR)) verarbeiten oder die
						Verarbeitung im Rahmen der Inanspruchnahme von Diensten
						Dritter oder der Offenlegung bzw. Übermittlung von Daten
						an andere Personen, Stellen oder Unternehmen
						stattfindet, erfolgt dies nur im Einklang mit den
						gesetzlichen Vorgaben.{" "}
					</p>
					<p>
						Vorbehaltlich ausdrücklicher Einwilligung oder
						vertraglich oder gesetzlich erforderlicher Übermittlung
						verarbeiten oder lassen wir die Daten nur in
						Drittländern mit einem anerkannten Datenschutzniveau,
						vertraglichen Verpflichtung durch sogenannte
						Standardschutzklauseln der EU-Kommission, beim Vorliegen
						von Zertifizierungen oder verbindlicher internen
						Datenschutzvorschriften verarbeiten (Art. 44 bis 49
						DSGVO, Informationsseite der EU-Kommission:{" "}
						<Link
							href="https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection_de"
							target="_blank"
						>
							https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection_de
						</Link>
						).
					</p>
				</section>

				<section className="mt-6">
					<h2 id="m12">Löschung von Daten</h2>
					<p>
						Die von uns verarbeiteten Daten werden nach Maßgabe der
						gesetzlichen Vorgaben gelöscht, sobald deren zur
						Verarbeitung erlaubten Einwilligungen widerrufen werden
						oder sonstige Erlaubnisse entfallen (z.B. wenn der Zweck
						der Verarbeitung dieser Daten entfallen ist oder sie für
						den Zweck nicht erforderlich sind). Sofern die Daten
						nicht gelöscht werden, weil sie für andere und
						gesetzlich zulässige Zwecke erforderlich sind, wird
						deren Verarbeitung auf diese Zwecke beschränkt. D.h.,
						die Daten werden gesperrt und nicht für andere Zwecke
						verarbeitet. Das gilt z.B. für Daten, die aus handels-
						oder steuerrechtlichen Gründen aufbewahrt werden müssen
						oder deren Speicherung zur Geltendmachung, Ausübung oder
						Verteidigung von Rechtsansprüchen oder zum Schutz der
						Rechte einer anderen natürlichen oder juristischen
						Person erforderlich ist.{" "}
					</p>
					<p>
						Unsere Datenschutzhinweise können ferner weitere Angaben
						zu der Aufbewahrung und Löschung von Daten beinhalten,
						die für die jeweiligen Verarbeitungen vorrangig gelten.
					</p>
				</section>

				<section className="mt-6">
					<h2 id="m225">
						Bereitstellung des Onlineangebotes und Webhosting
					</h2>
					<p>
						Wir verarbeiten die Daten der Nutzer, um ihnen unsere
						Online-Dienste zur Verfügung stellen zu können. Zu
						diesem Zweck verarbeiten wir die IP-Adresse des Nutzers,
						die notwendig ist, um die Inhalte und Funktionen unserer
						Online-Dienste an den Browser oder das Endgerät der
						Nutzer zu übermitteln.
					</p>
					<ul className="m-elements list-disc">
						<li>
							<strong>Verarbeitete Datenarten:</strong>{" "}
							Nutzungsdaten (z.B. besuchte Webseiten, Interesse an
							Inhalten, Zugriffszeiten); Meta-/Kommunikationsdaten
							(z.B. Geräte-Informationen, IP-Adressen).
						</li>
						<li>
							<strong>Betroffene Personen:</strong> Nutzer (z.B.
							Webseitenbesucher, Nutzer von Onlinediensten).
						</li>
						<li>
							<strong>Zwecke der Verarbeitung:</strong>{" "}
							Bereitstellung unseres Onlineangebotes und
							Nutzerfreundlichkeit; Informationstechnische
							Infrastruktur (Betrieb und Bereitstellung von
							Informationssystemen und technischen Geräten
							(Computer, Server etc.).); Sicherheitsmaßnahmen.
						</li>
						<li>
							<strong>Rechtsgrundlagen:</strong> Berechtigte
							Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).
						</li>
					</ul>
					<p>
						<strong>
							Weitere Hinweise zu Verarbeitungsprozessen,
							Verfahren und Diensten:
						</strong>
					</p>
					<ul className="m-elements list-disc">
						<li>
							<strong>
								Bereitstellung Onlineangebot auf gemietetem
								Speicherplatz:{" "}
							</strong>
							Für die Bereitstellung unseres Onlineangebotes
							nutzen wir Speicherplatz, Rechenkapazität und
							Software, die wir von einem entsprechenden
							Serveranbieter (auch &#34;Webhoster&#34; genannt)
							mieten oder anderweitig beziehen;
							<strong>Rechtsgrundlagen:</strong> Berechtigte
							Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).
						</li>
						<li>
							<strong>
								Erhebung von Zugriffsdaten und Logfiles:{" "}
							</strong>
							Der Zugriff auf unser Onlineangebot wird in Form von
							so genannten &#34;Server-Logfiles&#34;
							protokolliert. Zu den Serverlogfiles können die
							Adresse und Name der abgerufenen Webseiten und
							Dateien, Datum und Uhrzeit des Abrufs, übertragene
							Datenmengen, Meldung über erfolgreichen Abruf,
							Browsertyp nebst Version, das Betriebssystem des
							Nutzers, Referrer URL (die zuvor besuchte Seite) und
							im Regelfall IP-Adressen und der anfragende Provider
							gehören. Die Serverlogfiles können zum einen zu
							Zwecken der Sicherheit eingesetzt werden, z.B., um
							eine Überlastung der Server zu vermeiden
							(insbesondere im Fall von missbräuchlichen
							Angriffen, sogenannten DDoS-Attacken) und zum
							anderen, um die Auslastung der Server und ihre
							Stabilität sicherzustellen;
							<strong>Rechtsgrundlagen:</strong> Berechtigte
							Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO);
							<strong>Löschung von Daten:</strong>{" "}
							Logfile-Informationen werden für die Dauer von
							maximal 30 Tagen gespeichert und danach gelöscht
							oder anonymisiert. Daten, deren weitere Aufbewahrung
							zu Beweiszwecken erforderlich ist, sind bis zur
							endgültigen Klärung des jeweiligen Vorfalls von der
							Löschung ausgenommen.
						</li>
						<li>
							<strong>Hetzner: </strong>Leistungen auf dem Gebiet
							der Bereitstellung von informationstechnischer
							Infrastruktur und verbundenen Dienstleistungen (z.B.
							Speicherplatz und/oder Rechenkapazitäten);
							<strong>Dienstanbieter:</strong> Hetzner Online
							GmbH, Industriestr. 25, 91710 Gunzenhausen,
							Deutschland;
							<strong>Rechtsgrundlagen:</strong> Berechtigte
							Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO);
							<strong>Website:</strong>{" "}
							<Link
								href="https://www.hetzner.com"
								target="_blank"
							>
								https://www.hetzner.com
							</Link>
							;<strong>Datenschutzerklärung:</strong>{" "}
							<Link
								href="https://www.hetzner.com/de/rechtliches/datenschutz"
								target="_blank"
							>
								https://www.hetzner.com/de/rechtliches/datenschutz
							</Link>
							;<strong>Auftragsverarbeitungsvertrag:</strong>{" "}
							<Link
								href="https://docs.hetzner.com/de/general/general-terms-and-conditions/data-privacy-faq/"
								target="_blank"
							>
								https://docs.hetzner.com/de/general/general-terms-and-conditions/data-privacy-faq/
							</Link>
							.
						</li>
					</ul>
				</section>

				<section className="mt-6">
					<h2 id="m182">Kontakt- und Anfragenverwaltung</h2>
					<p>
						Bei der Kontaktaufnahme mit uns (z.B. per
						Kontaktformular, E-Mail, Telefon oder via soziale
						Medien) sowie im Rahmen bestehender Nutzer- und
						Geschäftsbeziehungen werden die Angaben der anfragenden
						Personen verarbeitet soweit dies zur Beantwortung der
						Kontaktanfragen und etwaiger angefragter Maßnahmen
						erforderlich ist.
					</p>
					<ul className="m-elements list-disc">
						<li>
							<strong>Verarbeitete Datenarten:</strong>{" "}
							Kontaktdaten (z.B. E-Mail, Telefonnummern);
							Inhaltsdaten (z.B. Eingaben in Onlineformularen);
							Nutzungsdaten (z.B. besuchte Webseiten, Interesse an
							Inhalten, Zugriffszeiten); Meta-/Kommunikationsdaten
							(z.B. Geräte-Informationen, IP-Adressen).
						</li>
						<li>
							<strong>Betroffene Personen:</strong>{" "}
							Kommunikationspartner.
						</li>
						<li>
							<strong>Zwecke der Verarbeitung:</strong>{" "}
							Kontaktanfragen und Kommunikation; Verwaltung und
							Beantwortung von Anfragen; Feedback (z.B. Sammeln
							von Feedback via Online-Formular); Bereitstellung
							unseres Onlineangebotes und Nutzerfreundlichkeit.
						</li>
						<li>
							<strong>Rechtsgrundlagen:</strong> Berechtigte
							Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).
						</li>
					</ul>
				</section>

				<section className="mt-6">
					<h2 id="m136">
						Präsenzen in sozialen Netzwerken (Social Media)
					</h2>
					<p>
						Wir unterhalten Onlinepräsenzen innerhalb sozialer
						Netzwerke und verarbeiten in diesem Rahmen Daten der
						Nutzer, um mit den dort aktiven Nutzern zu kommunizieren
						oder um Informationen über uns anzubieten.
					</p>
					<p>
						Wir weisen darauf hin, dass dabei Daten der Nutzer
						außerhalb des Raumes der Europäischen Union verarbeitet
						werden können. Hierdurch können sich für die Nutzer
						Risiken ergeben, weil so z.B. die Durchsetzung der
						Rechte der Nutzer erschwert werden könnte.
					</p>
					<p>
						Ferner werden die Daten der Nutzer innerhalb sozialer
						Netzwerke im Regelfall für Marktforschungs- und
						Werbezwecke verarbeitet. So können z.B. anhand des
						Nutzungsverhaltens und sich daraus ergebender Interessen
						der Nutzer Nutzungsprofile erstellt werden. Die
						Nutzungsprofile können wiederum verwendet werden, um
						z.B. Werbeanzeigen innerhalb und außerhalb der Netzwerke
						zu schalten, die mutmaßlich den Interessen der Nutzer
						entsprechen. Zu diesen Zwecken werden im Regelfall
						Cookies auf den Rechnern der Nutzer gespeichert, in
						denen das Nutzungsverhalten und die Interessen der
						Nutzer gespeichert werden. Ferner können in den
						Nutzungsprofilen auch Daten unabhängig der von den
						Nutzern verwendeten Geräte gespeichert werden
						(insbesondere, wenn die Nutzer Mitglieder der jeweiligen
						Plattformen sind und bei diesen eingeloggt sind).
					</p>
					<p>
						Für eine detaillierte Darstellung der jeweiligen
						Verarbeitungsformen und der Widerspruchsmöglichkeiten
						(Opt-Out) verweisen wir auf die Datenschutzerklärungen
						und Angaben der Betreiber der jeweiligen Netzwerke.
					</p>
					<p>
						Auch im Fall von Auskunftsanfragen und der
						Geltendmachung von Betroffenenrechten weisen wir darauf
						hin, dass diese am effektivsten bei den Anbietern
						geltend gemacht werden können. Nur die Anbieter haben
						jeweils Zugriff auf die Daten der Nutzer und können
						direkt entsprechende Maßnahmen ergreifen und Auskünfte
						geben. Sollten Sie dennoch Hilfe benötigen, dann können
						Sie sich an uns wenden.
					</p>
					<ul className="m-elements list-disc">
						<li>
							<strong>Verarbeitete Datenarten:</strong>{" "}
							Kontaktdaten (z.B. E-Mail, Telefonnummern);
							Inhaltsdaten (z.B. Eingaben in Onlineformularen);
							Nutzungsdaten (z.B. besuchte Webseiten, Interesse an
							Inhalten, Zugriffszeiten); Meta-/Kommunikationsdaten
							(z.B. Geräte-Informationen, IP-Adressen).
						</li>
						<li>
							<strong>Betroffene Personen:</strong> Nutzer (z.B.
							Webseitenbesucher, Nutzer von Onlinediensten).
						</li>
						<li>
							<strong>Zwecke der Verarbeitung:</strong>{" "}
							Kontaktanfragen und Kommunikation; Feedback (z.B.
							Sammeln von Feedback via Online-Formular);
							Marketing.
						</li>
						<li>
							<strong>Rechtsgrundlagen:</strong> Berechtigte
							Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).
						</li>
					</ul>
					<p>
						<strong>
							Weitere Hinweise zu Verarbeitungsprozessen,
							Verfahren und Diensten:
						</strong>
					</p>
					<ul className="m-elements list-disc">
						<li>
							<strong>Twitter: </strong>Soziales Netzwerk;{" "}
							<strong>Dienstanbieter:</strong> Twitter
							International Company, One Cumberland Place, Fenian
							Street, Dublin 2 D02 AX07, Irland,
							Mutterunternehmen: Twitter Inc., 1355 Market Street,
							Suite 900, San Francisco, CA 94103, USA;{" "}
							<strong>Rechtsgrundlagen:</strong>
							Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f)
							DSGVO); <strong>Datenschutzerklärung:</strong>{" "}
							<Link
								href="https://twitter.com/privacy"
								target="_blank"
							>
								https://twitter.com/privacy
							</Link>
							, (Settings:{" "}
							<Link
								href="https://twitter.com/personalization"
								target="_blank"
							>
								https://twitter.com/personalization
							</Link>
							).
						</li>
					</ul>
				</section>

				<section className="mt-6">
					<h2 id="m328">
						Plugins und eingebettete Funktionen sowie Inhalte
					</h2>
					<p>
						Wir binden in unser Onlineangebot Funktions- und
						Inhaltselemente ein, die von den Servern ihrer
						jeweiligen Anbieter (nachfolgend bezeichnet als
						&#34;Drittanbieter&#34;) bezogen werden. Dabei kann es
						sich zum Beispiel um Grafiken, Videos oder Stadtpläne
						handeln (nachfolgend einheitlich bezeichnet als
						&#34;Inhalte&#34;).
					</p>
					<p>
						Die Einbindung setzt immer voraus, dass die
						Drittanbieter dieser Inhalte die IP-Adresse der Nutzer
						verarbeiten, da sie ohne die IP-Adresse die Inhalte
						nicht an deren Browser senden könnten. Die IP-Adresse
						ist damit für die Darstellung dieser Inhalte oder
						Funktionen erforderlich. Wir bemühen uns, nur solche
						Inhalte zu verwenden, deren jeweilige Anbieter die
						IP-Adresse lediglich zur Auslieferung der Inhalte
						verwenden. Drittanbieter können ferner sogenannte
						Pixel-Tags (unsichtbare Grafiken, auch als &#34;Web
						Beacons&#34; bezeichnet) für statistische oder
						Marketingzwecke verwenden. Durch die
						&#34;Pixel-Tags&#34; können Informationen, wie der
						Besucherverkehr auf den Seiten dieser Webseite,
						ausgewertet werden. Die pseudonymen Informationen können
						ferner in Cookies auf dem Gerät der Nutzer gespeichert
						werden und unter anderem technische Informationen zum
						Browser und zum Betriebssystem, zu verweisenden
						Webseiten, zur Besuchszeit sowie weitere Angaben zur
						Nutzung unseres Onlineangebotes enthalten als auch mit
						solchen Informationen aus anderen Quellen verbunden
						werden.
					</p>
					<ul className="m-elements list-disc">
						<li>
							<strong>Verarbeitete Datenarten:</strong>{" "}
							Nutzungsdaten (z.B. besuchte Webseiten, Interesse an
							Inhalten, Zugriffszeiten); Meta-/Kommunikationsdaten
							(z.B. Geräte-Informationen, IP-Adressen).
						</li>
						<li>
							<strong>Betroffene Personen:</strong> Nutzer (z.B.
							Webseitenbesucher, Nutzer von Onlinediensten).
						</li>
						<li>
							<strong>Zwecke der Verarbeitung:</strong>{" "}
							Bereitstellung unseres Onlineangebotes und
							Nutzerfreundlichkeit.
						</li>
						<li>
							<strong>Rechtsgrundlagen:</strong> Berechtigte
							Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).
						</li>
					</ul>
					<p>
						<strong>
							Weitere Hinweise zu Verarbeitungsprozessen,
							Verfahren und Diensten:
						</strong>
					</p>
					<ul className="m-elements">
						<li>
							<strong>
								Google Fonts (Bereitstellung auf eigenem
								Server):{" "}
							</strong>
							Bereitstellung von Schriftarten-Dateien zwecks einer
							nutzerfreundlichen Darstellung unseres
							Onlineangebotes;
							<strong>Dienstanbieter:</strong> Die Google Fonts
							werden auf unserem Server gehostet, es werden keine
							Daten an Google übermittelt;{" "}
							<strong>Rechtsgrundlagen:</strong> Berechtigte
							Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO).
						</li>
					</ul>
				</section>

				<section className="mt-6">
					<h2 id="m15">
						Änderung und Aktualisierung der Datenschutzerklärung
					</h2>
					<p>
						Wir bitten Sie, sich regelmäßig über den Inhalt unserer
						Datenschutzerklärung zu informieren. Wir passen die
						Datenschutzerklärung an, sobald die Änderungen der von
						uns durchgeführten Datenverarbeitungen dies erforderlich
						machen. Wir informieren Sie, sobald durch die Änderungen
						eine Mitwirkungshandlung Ihrerseits (z.B. Einwilligung)
						oder eine sonstige individuelle Benachrichtigung
						erforderlich wird.
					</p>
					<p>
						Sofern wir in dieser Datenschutzerklärung Adressen und
						Kontaktinformationen von Unternehmen und Organisationen
						angeben, bitten wir zu beachten, dass die Adressen sich
						über die Zeit ändern können und bitten die Angaben vor
						Kontaktaufnahme zu prüfen.
					</p>
					<h2>Rechte der betroffenen Personen</h2>
					<p>
						Ihnen stehen als betroffene nach der DSGVO verschiedene
						Rechte zu, die sich insbesondere aus Art. 15 bis 21
						DSGVO ergeben:
					</p>
					<ul className="list-disc ml-6 mb-6">
						<li>
							<strong>
								Widerspruchsrecht: Sie haben das Recht, aus
								Gründen, die sich aus Ihrer besonderen Situation
								ergeben, jederzeit gegen die Verarbeitung der
								Sie betreffenden personenbezogenen Daten, die
								aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO
								erfolgt, Widerspruch einzulegen; dies gilt auch
								für ein auf diese Bestimmungen gestütztes
								Profiling. Werden die Sie betreffenden
								personenbezogenen Daten verarbeitet, um
								Direktwerbung zu betreiben, haben Sie das Recht,
								jederzeit Widerspruch gegen die Verarbeitung der
								Sie betreffenden personenbezogenen Daten zum
								Zwecke derartiger Werbung einzulegen; dies gilt
								auch für das Profiling, soweit es mit solcher
								Direktwerbung in Verbindung steht.
							</strong>
						</li>
						<li>
							<strong>Widerrufsrecht bei Einwilligungen:</strong>{" "}
							Sie haben das Recht, erteilte Einwilligungen
							jederzeit zu widerrufen.
						</li>
						<li>
							<strong>Auskunftsrecht:</strong> Sie haben das
							Recht, eine Bestätigung darüber zu verlangen, ob
							betreffende Daten verarbeitet werden und auf
							Auskunft über diese Daten sowie auf weitere
							Informationen und Kopie der Daten entsprechend den
							gesetzlichen Vorgaben.
						</li>
						<li>
							<strong>Recht auf Berichtigung:</strong> Sie haben
							entsprechend den gesetzlichen Vorgaben das Recht,
							die Vervollständigung der Sie betreffenden Daten
							oder die Berichtigung der Sie betreffenden
							unrichtigen Daten zu verlangen.
						</li>
						<li>
							<strong>
								Recht auf Löschung und Einschränkung der
								Verarbeitung:
							</strong>{" "}
							Sie haben nach Maßgabe der gesetzlichen Vorgaben das
							Recht, zu verlangen, dass Sie betreffende Daten
							unverzüglich gelöscht werden, bzw. alternativ nach
							Maßgabe der gesetzlichen Vorgaben eine Einschränkung
							der Verarbeitung der Daten zu verlangen.
						</li>
						<li>
							<strong>Recht auf Datenübertragbarkeit:</strong> Sie
							haben das Recht, Sie betreffende Daten, die Sie uns
							bereitgestellt haben, nach Maßgabe der gesetzlichen
							Vorgaben in einem strukturierten, gängigen und
							maschinenlesbaren Format zu erhalten oder deren
							Übermittlung an einen anderen Verantwortlichen zu
							fordern.
						</li>
						<li>
							<strong>Beschwerde bei Aufsichtsbehörde:</strong>{" "}
							Sie haben unbeschadet eines anderweitigen
							verwaltungsrechtlichen oder gerichtlichen
							Rechtsbehelfs das Recht auf Beschwerde bei einer
							Aufsichtsbehörde, insbesondere in dem Mitgliedstaat
							ihres gewöhnlichen Aufenthaltsorts, ihres
							Arbeitsplatzes oder des Orts des mutmaßlichen
							Verstoßes, wenn Sie der Ansicht sind, dass die
							Verarbeitung der Sie betreffenden personenbezogenen
							Daten gegen die Vorgaben der DSGVO verstößt.
						</li>
					</ul>
				</section>

				<section className="mt-6">
					<h2 id="m42">Begriffsdefinitionen</h2>
					<p>
						In diesem Abschnitt erhalten Sie eine Übersicht über die
						in dieser Datenschutzerklärung verwendeten
						Begrifflichkeiten. Viele der Begriffe sind dem Gesetz
						entnommen und vor allem im Art. 4 DSGVO definiert. Die
						gesetzlichen Definitionen sind verbindlich. Die
						nachfolgenden Erläuterungen sollen dagegen vor allem dem
						Verständnis dienen. Die Begriffe sind alphabetisch
						sortiert.
					</p>
					<ul className="glossary list-disc">
						<li>
							<strong>Personenbezogene Daten:</strong>{" "}
							&#34;Personenbezogene Daten&#34; sind alle
							Informationen, die sich auf eine identifizierte oder
							identifizierbare natürliche Person (im Folgenden
							&#34;betroffene Person“) beziehen; als
							identifizierbar wird eine natürliche Person
							angesehen, die direkt oder indirekt, insbesondere
							mittels Zuordnung zu einer Kennung wie einem Namen,
							zu einer Kennnummer, zu Standortdaten, zu einer
							Online-Kennung (z.B. Cookie) oder zu einem oder
							mehreren besonderen Merkmalen identifiziert werden
							kann, die Ausdruck der physischen, physiologischen,
							genetischen, psychischen, wirtschaftlichen,
							kulturellen oder sozialen Identität dieser
							natürlichen Person sind.
						</li>
						<li>
							<strong>Verantwortlicher:</strong> Als
							&#34;Verantwortlicher&#34; wird die natürliche oder
							juristische Person, Behörde, Einrichtung oder andere
							Stelle, die allein oder gemeinsam mit anderen über
							die Zwecke und Mittel der Verarbeitung von
							personenbezogenen Daten entscheidet, bezeichnet.
						</li>
						<li>
							<strong>Verarbeitung:</strong>{" "}
							&#34;Verarbeitung&#34; ist jeder mit oder ohne Hilfe
							automatisierter Verfahren ausgeführte Vorgang oder
							jede solche Vorgangsreihe im Zusammenhang mit
							personenbezogenen Daten. Der Begriff reicht weit und
							umfasst praktisch jeden Umgang mit Daten, sei es das
							Erheben, das Auswerten, das Speichern, das
							Übermitteln oder das Löschen.
						</li>
					</ul>

					<div className="seal">
						<Link
							href="https://datenschutz-generator.de/"
							title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken."
							target="_blank"
							rel="noopener noreferrer nofollow"
						>
							Erstellt mit kostenlosem Datenschutz-Generator.de
							von Dr. Thomas Schwenke
						</Link>
					</div>
				</section>

				<section>
					<div className="seal mt-4">
						<Link
							href="https://github.com/zauberware/postal-codes-json-xml-csv"
							className="underline flex items-center"
						>
							<FontAwesomeIcon
								icon={faCreativeCommons}
								className="w-5 h-5 inline-block mr-2 relative bottom-[2px]"
							/>
							<span>Städte-Daten von Simon Franzen</span>
						</Link>
					</div>
				</section>
			</div>
		</>
	);
}
