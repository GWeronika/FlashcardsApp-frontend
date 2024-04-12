import React from 'react';
import Menu from './MainMenu';
import MainButton from './MainButton';
import '../styles/Menu.css';

const MainPage = () => {
    return (
        <div>
            <header>
                <h2 className="logo"><img src="/logo.png" alt="Logo"/></h2>
                <nav className="menu">
                    <ul>
                        <Menu ahr="" text={<><i className="fa-solid fa-book-bookmark" style={{color: '#919191'}}></i> Sets</>} />
                        <Menu ahr="" text={<><i className="fa-solid fa-square-plus" style={{color: '#919191'}}></i> Create</>} />
                        <Menu ahr="" text={<><i className="fa-solid fa-user" style={{color: '#919191'}}></i> Log in</>} />
                    </ul>
                </nav>
            </header>
            <main>
                <section className="main-image">
                    <h2 className="main-text">For better learning<br/><br/>Create your own flashcards and learn<br/>faster, better and more efficiently.</h2>
                    <img src="/main.png" alt="MainImage"/>
                </section>
            </main>
            <footer>
                <section>
                    <MainButton text={<><strong className="bold-text">Register</strong> to discover new possibilities</>} />
                    <MainButton text={<><strong className="bold-text">Log in</strong> to make progress</>} />
                    <MainButton text={<><strong className="bold-text">Create a set</strong> to make a difference</>} />
                </section>
            </footer>
        </div>
    );
}

export default MainPage;
