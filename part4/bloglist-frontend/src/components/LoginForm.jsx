import { Button, TextField } from "@mui/material";

const LoginForm = ({
	handleLogin,
	username,
	password,
	handleUsername,
	handlePassword,
}) => {
	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div>
					<TextField
						label="username"
						value={username}
						onChange={handleUsername}
					/>
				</div>
				<div>
					<TextField
						label="password"
						value={password}
						onChange={handlePassword}
						style={{ marginTop: 10 }}
					/>
				</div>
				<Button type="submit" variant="contained" style={{ marginTop: 10 }}>
					login
				</Button>
			</form>
		</div>
	);
};

export default LoginForm;
