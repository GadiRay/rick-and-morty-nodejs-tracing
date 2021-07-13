import { useEffect, useState } from 'react';
import './App.css';

import CharacterDetails from './CharacterDetails';
import Details from './Details';

const defaultDetails: Details = {
    name: '',
    gender: '',
    image: '',
    species: '',
    status: ''
}

function App() {
    const [list, setList] = useState([]);
    const [details, setDetails] = useState({ isReady: false, data: defaultDetails});

    useEffect(() => {
        fetch('http://localhost:3002/api/v1/characters', { headers: { authorization: 'Basic 12345' } })
            .then((results) => results.json())
            .then((characters) => setList(characters));
    }, []);

    function getCharacterDetails(id: string) {
        fetch(`http://localhost:3002/api/v1/characters/${id}`, { headers: { authorization: 'Basic 12345' } })
            .then((results) => results.json())
            .then((charDetails) => setDetails({isReady: true, data: charDetails}));
    }
    console.log({ list });
    return (
        <div className="App">
            <h1>Rick And Morty Characters</h1>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
                {list.map(({ id, name }) => (
                    <tr
                        onClick={() => {
                            getCharacterDetails(id);
                        }}
                    >
                        <th>{id}</th>
                        <th>{name}</th>
                    </tr>
                ))}
            </table>
            {details && details.isReady && <CharacterDetails {...details.data} />}
        </div>
    );
}

export default App;
