import { useState, useContext } from "react"
import style from "./Login.module.css"
import GoogleIcon from "@/public/google.png"
import Image from "next/image"
import { CreateUserEmailPassword, SignInEmailPassword, SignInGoogle } from "@/lib/firebase/auth/auth"
import { UserContext } from "@/app/contexts"

export function Login() {
	const [email, setEmail] = useState<string>("")
	const [pass, setPass] = useState<string>("")
	const [, setUser] = useContext(UserContext)
	const [uiError, setUiError] = useState<string>("")

	return (
		<div className={style.card_container}>
			<div className={style.card}>
				{/* Visual feedback for errors */}
				{uiError && <p style={{ color: "red", textAlign: "center" }}>{uiError}</p>}

				<div className={style.input_bar}>
					<h3>Email</h3>
					<input type="email" placeholder={"user@example.com"} onChange={(e) => {
						e.preventDefault();
						setEmail(e.target.value)
					}} />
				</div>
				<div className={style.input_bar}>
					<h3>Password</h3>
					<input type="password" placeholder={""} onChange={(e) => {
						e.preventDefault();
						setPass(e.target.value)
					}} />
				</div>
				<div className={style.alternate_option}>
					<button type="button">
						Forgot Password
					</button>
				</div>
				<button type="submit" className={style.submit} onClick={() => {
					setUiError("");
					SignInEmailPassword(email, pass)
						.then((user) => {
							if (user) {
								setUser(user);
							} else {
								setUiError("Failed to load user data. You might be offline.");
							}
						})
						.catch((err) => {
							console.error(err);
							setUiError("Login timed out. Check your connection.");
						});
				}}>
					Sign In
				</button>
				<button type="submit" className={style.submit} onClick={() => {
					setUiError("");
					CreateUserEmailPassword(email, pass)
						.then((user) => {
							if (user) {
								setUser(user);
							} else {
								setUiError("Could not create account data.");
							}
						})
						.catch((err) => {
							console.error(err);
							setUiError("Account creation failed or timed out.");
						});
				}}>
					Create Account
				</button>
				<div className={style.option_seperator}>
					<div />
					<h4>OR</h4>
					<div />
				</div>
				<>
					<button title="Google Provider" type="button" className={style.oauth_option} onClick={() => {
						setUiError("");
						SignInGoogle()
							.then((user) => {
								if (user) setUser(user);
							})
							.catch((err) => {
								console.error(err);
								setUiError("Google sign-in was blocked or interrupted.");
							});
					}}>
						<Image alt="googleIcon" loading={"lazy"} src={GoogleIcon} />
					</button>
				</>
			</div>
		</div>
	)
}