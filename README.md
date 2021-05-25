# kube-hocs-frontend
Contains config maps for the docs-converter and the frontend. And the deployment script for the frontend.

The associated network policies are instead stored in [UKHomeOffice/kube-hocs](https://github.com/ukhomeoffice/kube-hocs).

If you change the ingress hostname, ensure you also add it as an acceptable
redirect URI in the appropriate client configuration in the relevant Keycloak
security admin console.

## Keycloak configuration

We use [Keycloak](https://www.keycloak.org/) for identity and access management.
You should create a new Keycloak client for each app, so they can be configured
separately.

### Create new client
To create a new Keycloak client, log into the Keycloak admin console, then
"Configure Clients" and then "Create". The client protocol should be "openid-connect".
The client authenticator should be "Client Id and Secret".

As you're usually creating a new nonproduction environment, it's a good idea to
first hit "Export" on an existing client and then "Import" it at the create step.

### Edit redirect URIs

You should then ensure the "Valid Redirect URIs" accurately reflect the ingresses
on the namespace. For clients with multiple aliased hostnames, set both HTTP
and HTTPS variants. For namespaces with only one, set the root URL instead.

### Update aud mapper

For [obscure reasons](https://github.com/louketo/louketo-proxy/issues/567) you
need to also ensure the `aud` mapper is set with the "Claim value" matching your
client ID.

### Edit secret

Once you configure the client on the Keycloak side, you need to give the
credentials to the keycloak-gatekeeper app, by changing the values within the
`frontend-keycloak-secret` to match the "client ID" (on the "Settings" tab) and
"Secret" (on the "Credentials" tab).

The `frontend-keycloak-secret` is a YAML file within a YAML file:
```console
$ cat foo.yml
client-id: hocs-frontend
client-secret: f5ce9f30-3f81-491e-93ef-b7dc5f4654c4
$ base64 foo.yml
Y2xpZW50LWlkOiBob2NzLWZyb250ZW5kCmNsaWVudC1zZWNyZXQ6IGY1Y2U5ZjMwLTNmODEtNDkxZS05M2VmLWI3ZGM1ZjQ2NTRjNAo=
$ # the easiest way to modify an existing secret is probably:
$ base64 foo.yml | pbcopy
$ kubectl edit secret frontend-keycloak-secret # and paste the replacement against data.yml
$ # or to do it afresh:
$ kubectl create secret generic frontend-keycloak-secret \
  --from-file=data.yml=./foo.yml
```
