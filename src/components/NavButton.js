import React, {Component} from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import './NavButton.css';

import {NavLink, withRouter} from 'react-router-dom';

const NavButton = withRouter(({history, className, text, goTo, img}) => (
    <NavLink to={goTo} className={className}>
        {text}
        <img className={img ? "" : "hidden"} src={img}/>
    </NavLink>
));

export default NavButton;

{/*<button*/
}
{/*className={className}*/
}
{/*type='button'*/
}
{/*onClick={() => { history.push(goTo) }} >*/
}
{/*{text}*/
}
{/*<img className={img ? "" : "hidden"} src={img}/>*/
}
{/*</button>*/
}
