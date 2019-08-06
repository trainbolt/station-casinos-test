import axios from "axios";

const users = {
  getUser: async (req, res, next) => {
    try {
      const { data } = await axios.get(
        `https://jsonplaceholder.typicode.com/users/${req.params.id}`
      );
      const userData = pruneData([data]);
      res.status(200).json(userData);
    } catch (err) {
      res.status(err.response.status).json({ err });
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const { data } = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const userData = pruneData(data);
      res.status(200).json(userData);
    } catch (err) {
      res.status(err.response.status).json({ err });
    }
  }
};

// Pick off just the data we need which will prevent
// bloating our redux store etc.
const pruneData = data => {
  return data.map(d => {
    const { id, name, address, phone } = d;
    return { id, name, address, phone };
  });
};

export default users;
