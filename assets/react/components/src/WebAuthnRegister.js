import { getRegisterOptions } from '../../services/webauthn';

async function registerWebAuthn() {
    const options = await getRegisterOptions();
    const credential = await navigator.credentials.create({
        publicKey: options,
    });

    console.log("Clé WebAuthn créée :", credential);
}

<button onClick={registerWebAuthn}>S'inscrire avec WebAuthn</button>
