
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import LogIn from './components/LogIn';
// import HomePage from './components/HomePage';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LogIn />} />
//         <Route path="/home" element={<HomePage />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './components/LogIn';
import HomePage from './components/HomePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
