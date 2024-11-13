import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '15px', fontSize: '28px', fontWeight: 'bold', color: '#333' }}>ZeotapAST</span>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontSize: '18px', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = '#0056b3'} onMouseOut={e => e.target.style.color = '#007bff'}>Home</Link>
      </div>
    </div>
  );
}

export default Navbar;