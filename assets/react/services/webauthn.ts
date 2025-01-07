export async function getRegisterOptions() {
    const response = await fetch('http://127.0.0.1:8000/webauthn/register/options');
    return response.json();
}

export async function getLoginOptions() {
    const response = await fetch('http://127.0.0.1:8000/webauthn/login/options');
    return response.json();
}

