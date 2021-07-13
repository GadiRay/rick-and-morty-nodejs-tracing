import Details from './Details';

function CharaterDetails({ gender, image, name, species, status }: Details) {
    console.log({ gender, image, name, species, status });
    return (
        <div>
            <h2>{name} Details:</h2>
            <div>
                Gender: {gender}
            </div>
            <div>
                Species: {species}
            </div>
            <div>
                Status: {status}
            </div>
            <br />
            <br />
            
            <div>
                <img src={image} alt="rick and morty chatacter"></img>
            </div>
        </div>
    );
}

export default CharaterDetails;
