import { getLoginOptions } from '../../services/webauthn';

async function loginWebAuthn() {
    const options = await getLoginOptions();
    const credential = await navigator.credentials.get({
        publicKey: options,
    });

    console.log("Connexion WebAuthn réussie :", credential);
}

<button onClick={loginWebAuthn}>Se connecter avec WebAuthn</button>
