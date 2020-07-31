# kube-hocs-frontend
Contains config maps for the docs-converter and the frontend. And the deployment script for the frontend.

The associated network policies are instead stored in [UKHomeOffice/kube-hocs](https://github.com/ukhomeoffice/kube-hocs).

If you change the ingress hostname, ensure you also add it as an acceptable
redirect URI in the appropriate client configuration in the relevant Keycloak
security admin console.
