import React, { Component } from "react";
import axios from "axios";

const addressStyle = {
  fontSize: ".7rem",
  lineHeight: "1.1rem",
  display: "block"
};

const buttonStyle = {
  position: "absolute",
  top: 0,
  right: 15,
  minWidth: 80
};

const loadingStyle = {
  width: "100%",
  marginTop: 50,
  textAlign: "center",
  fontWeight: 100
};

const errorStyle = {
  color: "red"
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userData: null,
      showDataArr: [],
      search: "",
      error: null
    };
  }

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = (id = "") => {
    this.setState({ loading: true, error: null });
    axios
      .get(`/api/users${id ? `/${id}` : ``}`)
      .then(res => {
        this.setState({
          userData: res.data,
          showDataArr: [],
          loading: false,
          error: null
        });
      })
      .catch(({ response }) => {
        const { status, statusText } = response;
        this.setState({
          userData: null,
          showDataArr: [],
          error: { status, statusText },
          loading: false
        });
      });
  };

  unloadUsers = () => {
    this.setState({ userData: [], showDataArr: [], error: null });
  };

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

  handleSearchInput = e => {
    this.setState({ search: e.target.value });
  };

  userSearch = () => {
    this.loadUsers(this.state.search);
  };

  render() {
    const { loading, userData, showDataArr, search, error } = this.state;
    return (
      <div className="container" data-test="component-app">
        <div className="row" style={{ margin: "50px 0" }}>
          <div className="col-lg-12">
            <div className="input-group input-group-sm">
              <div className="input-group-prepend">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => this.unloadUsers()}
                >
                  Unload Users
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.loadUsers()}
                >
                  Load All Users
                </button>
              </div>
              <input
                type="number"
                className="form-control"
                placeholder="Enter an id..."
                onChange={this.handleSearchInput}
                value={search}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={() => this.userSearch()}
                >
                  Search
                </button>
              </div>
            </div>

            <hr />
          </div>
          {!loading && userData && userData.length === 0 && (
            <div className="col-lg-12">
              <h1 style={loadingStyle}>No users to show</h1>
            </div>
          )}
          {userData &&
            userData.length > 0 &&
            userData.map((user, i) => {
              const showData = showDataArr.indexOf(user.id) >= 0;
              return (
                <div className="col-lg-12" key={user.id} data-test="user-row">
                  <div className="media">
                    <img
                      className="mr-3"
                      src="http://via.placeholder.com/65"
                      alt="Generic placeholder image"
                    />
                    <div className="media-body">
                      <h6 className="mt-0">{user.name}</h6>
                      {showData && (
                        <small data-test="user-address" style={addressStyle}>
                          {user.phone}
                          <br />
                          {user.address.street} {user.address.suite},{" "}
                          {user.address.city} {user.address.zipcode}
                        </small>
                      )}
                      <button
                        type="button"
                        className={`btn btn-sm btn-${
                          showData ? "default" : "primary"
                        }`}
                        onClick={() => this.toggleDetails(user.id)}
                        style={buttonStyle}
                        data-test="address-btn"
                      >
                        {showData ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  {i < userData.length - 1 && <hr />}
                </div>
              );
            })}
          {loading && (
            <h1 data-test="loading-text" style={loadingStyle}>
              Loading.. please wait!
            </h1>
          )}
          {error && (
            <h1
              data-test="error-text"
              style={{ ...loadingStyle, ...errorStyle }}
            >
              {error.status} : {error.statusText}
            </h1>
          )}
        </div>
      </div>
    );
  }
}
