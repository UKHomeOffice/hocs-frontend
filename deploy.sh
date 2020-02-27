#!/bin/bash

export KUBE_NAMESPACE=${KUBE_NAMESPACE}
export KUBE_SERVER=${KUBE_SERVER}

if [[ -z ${VERSION} ]] ; then
    export VERSION=${IMAGE_VERSION}
fi
if [[ -z ${DOMAIN} ]] ; then
    export DOMAIN="cs"
fi
export DOMAIN=${DOMAIN}

export IP_WHITELIST=${POISE_WHITELIST}

if [[ ${ENVIRONMENT} == "prod" ]] ; then
    echo "deploy ${VERSION} to PROD namespace, using HOCS_FRONTEND_PROD drone secret"
    export KUBE_TOKEN=${HOCS_FRONTEND_PROD}
    export REPLICAS="2"
else
    if [[ ${ENVIRONMENT} == "qa" ]] ; then
        echo "deploy ${VERSION} to QA namespace, using HOCS_FRONTEND_QA drone secret"
        export KUBE_TOKEN=${HOCS_FRONTEND_QA}
        export REPLICAS="1"
    elif [[ ${ENVIRONMENT} == "demo" ]] ; then
        echo "deploy ${VERSION} to DEMO namespace, HOCS_FRONTEND_DEMO drone secret"
        export KUBE_TOKEN=${HOCS_FRONTEND_DEMO}
        export REPLICAS="1"
    elif [[ ${ENVIRONMENT} == "dev" ]] ; then
        echo "deploy ${VERSION} to DEV namespace, HOCS_FRONTEND_DEV drone secret"
        export KUBE_TOKEN=${HOCS_FRONTEND_DEV}
        export REPLICAS="1"
    else
        echo "Unable to find environment: ${ENVIRONMENT}"
    fi
    
fi

if [[ -z ${KUBE_TOKEN} ]] ; then
    echo "Failed to find a value for KUBE_TOKEN - exiting"
    exit -1
fi

if [[ "${KUBE_NAMESPACE}" == "wcs-prod" ]] ; then
    export DNS_PREFIX=www.${DOMAIN}
    export KC_REALM=https://sso.digital.homeoffice.gov.uk/auth/realms/HOCS
elif [[ "${ENVIRONMENT}" == "prod" ]] ; then
    export DNS_PREFIX=www.${DOMAIN}
    export KC_REALM=https://sso.digital.homeoffice.gov.uk/auth/realms/hocs-prod
else
    export DNS_PREFIX=${ENVIRONMENT}.${DOMAIN}-notprod
    export KC_REALM=https://sso-dev.notprod.homeoffice.gov.uk/auth/realms/hocs-notprod
fi

export DOMAIN_NAME=${DNS_PREFIX}.homeoffice.gov.uk

echo
echo "Deploying hocs-frontend to ${ENVIRONMENT}"
echo "Keycloak realm: ${KC_REALM}"
echo "Keycloak domain: ${KC_DOMAIN}"
echo "domain name: ${DOMAIN_NAME}"
echo

cd kd

kd --insecure-skip-tls-verify \
   --timeout 10m \
    -f ingress.yaml \
    -f converter-configmap.yaml \
    -f configmap.yaml \
    -f deployment.yaml \
    -f service.yaml
