# Nadia 2.0 App Local Installation:
NOTE: This guide has been tested on a Windows 10-11 system.

1. Please note that you will need [Docker Desktop](https://docs.docker.com/desktop/) open and running, from there: Install supabase.

2. Inside the project/repository folder, use this command:
```bash
supabase init && supabase start
```

From step 3 to step 12, refer to: https://www.keycloak.org/getting-started/getting-started-docker.<br/>
Note that in step 10, you must set the following option:
- Valid redirect URIs: `http://localhost:3000/*`

3. Install Keycloak for Docker:
```bash
docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:25.0.6 start-dev
```

4. Go to http://localhost:8080, log in as user: `admin` and password: `admin`

5. As admin: Create a realm, in this case, we call it "Anysolution."

6. As admin: Inside the "Anysolution" realm, create a user, although you may need to create a role for it. Then go to Credentials >> Set password, set the password, and set Temporary to _Off_.

7. Go to http://localhost:8080/realms/Anysolution/account. If the created user can log in, then you can log out afterward.

8. Create a Client:
- Set Client ID: `Data_visualization`
- Client type: `OpenID Connect`

9. After creating the Client, verify that the Standard flow is enabled. If it is, click Next.

10. To complete the Client creation, in Login settings, set the following:
- Valid redirect URIs: `http://localhost:3000/*`
- Web origins: `https://www.keycloak.org`
Then click Save.

11. Go to Client >> Data_visualization >> Settings >> Capability config >> set Client authentication to _On_, then click Save.

12. In Client >> Data_visualization >> Credentials >> Client Secret, find and copy the secret, and add it to `.env.local` under the KEYCLOAK_CLIENT_SECRET variable (reference: https://stackoverflow.com/questions/44752273/do-keycloak-clients-have-a-client-secret).

13. In the repository, your `.env.local` (that file must be created at the root of the project/repository) should have the following:
```bash
POSTGRES_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
KEYCLOAK_CLIENT_ID=Data_visualization
KEYCLOAK_CLIENT_SECRET=AGhRd1c5WglIro4xYklnpByFvRNQkxCA
KEYCLOAK_ISSUER=http://localhost:8080/realms/Anysolution
KEYCLOAK_END_SESSION_URL=http://localhost:8080/realms/Anysolution/protocol/openid-connect/logout
KEYCLOAK_REFRESH_TOKEN_URL=http://localhost:8080/realms/Anysolution/protocol/openid-connect/token
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET='125xyPycGWlonzTCbiFhkcBULEMwh92O3k711PoW5bi='
OCB_URL=http://www.anysolution.org:1027/v2
```
Note: `NEXTAUTH_SECRET` is generated using this Linux command:
```bash
openssl rand -base64 32
```
In Powershell:
```ps
bash -c "openssl rand -base64 32"
```
Copy the generated value, and it must be enclosed in single quotes (`'`), as shown.

14. Go to project/repository folder in the terminal/console, make sure to install dependencies using [`npm`](https://github.com/npm/cli?tab=readme-ov-file#installation), simply run:
```bash
npm install
```
After that, run the project:
```bash
npm run dev
```
And open http://localhost:3000 in your browser.
