import React, { Component } from "react";
import axios from "axios";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      showDataArr: [],
      error: null
    };
  }

  componentDidMount() {
    axios
      .get("/api/getUserData")
      .then(res => {
        this.setState({ userData: res.data });
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  toggleDetails = i => {
    const { showDataArr } = this.state;
    const newDataArr =
      showDataArr.indexOf(i) < 0
        ? showDataArr.concat(i)
        : showDataArr.filter(id => id !== i);
    this.setState({
      showDataArr: newDataArr
    });
  };

  render() {
    const { userData, showDataArr } = this.state;
    return (
      <div className="container" data-test="component-app">
        <div className="row" style={{ margin: "50px 0" }}>
          {userData ? (
            userData.map((user, i) => {
              const showData = showDataArr.indexOf(user.id) >= 0;
              return (
                <div className="col-lg-12" key={user.id}>
                  <div className="media">
                    <img
                      className="mr-3"
                      src="http://via.placeholder.com/75"
                      alt="Generic placeholder image"
                    />
                    <div className="media-body">
                      <h5 className="mt-0">{user.name}</h5>
                      {showData && (
                        <small>
                          {user.phone}
                          <br />
                          {user.address.street} {user.address.suite},{" "}
                          {user.address.city} {user.address.zipcode}
                        </small>
                      )}
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => this.toggleDetails(user.id)}
                        style={{ position: "absolute", top: 0, right: 15 }}
                      >
                        {showData ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  {i < userData.length - 1 && <hr />}
                </div>
              );
            })
          ) : (
            <h1>Loading.. please wait!</h1>
          )}
        </div>
      </div>
    );
  }
}
