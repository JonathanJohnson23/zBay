import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Mutations from "../graphql/mutations"
const { REGISTER_USER } = Mutations

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: ""
    };
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  updateCache(client, { data }) {
    console.log(data);
    client.writeData({
      data: { isLoggedIn: data.register.loggedIn }
    });
  }

  render() {
    return (
      <Mutation
        mutation={REGISTER_USER}
        onCompleted={data => {
          const { token } = data.register;
          localStorage.setItem("auth-token", token);
          this.props.history.push("/");
        }}
        update={(client, data) => this.updateCache(client, data)}
      >
        {registerUser => (
          <div>
            <form
              onSubmit={e => {
                e.preventDefault();
                registerUser({
                  variables: {
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                  }
                });
              }}
            >
              <input
                value={this.state.username}
                onChange={this.update("username")}
                placeholder="Username"
              />
              <input
                value={this.state.email}
                onChange={this.update("email")}
                placeholder="Email"
              />
              <input
                value={this.state.password}
                onChange={this.update("password")}
                type="password"
                placeholder="Password"
              />
              <button type="submit">Register Account</button>
            </form>
          </div>
        )}
      </Mutation>
    );
  }
}
export default Register;