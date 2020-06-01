#!/bin/bash

export KUBE_NAMESPACE=${ENVIRONMENT}
export KUBE_SERVER=${KUBE_SERVER}

if [[ -z ${VERSION} ]] ; then
    export VERSION=${IMAGE_VERSION}
fi
if [[ -z ${DOMAIN} ]] ; then
    export DOMAIN="cs"
fi
export DOMAIN=${DOMAIN}

export IP_WHITELIST=${POISE_WHITELIST}

if [[ ${KUBE_NAMESPACE} == "cs-prod" ]] ; then
    echo "deploy ${VERSION} to PROD namespace, using HOCS_FRONTEND_PROD_CS drone secret"
    export KUBE_TOKEN=${HOCS_FRONTEND_PROD_CS}
    export REPLICAS="2"
elif [[ ${KUBE_NAMESPACE} == "wcs-prod" ]] ; then
    echo "deploy ${VERSION} to PROD namespace, using HOCS_FRONTEND_PROD_WCS drone secret"
    export KUBE_TOKEN=${HOCS_FRONTEND_PROD_WCS}
    export REPLICAS="2"
elif [[ ${KUBE_NAMESPACE} == "cs-qa" ]] ; then
    echo "deploy ${VERSION} to QA namespace, using HOCS_FRONTEND_QA_CS drone secret"
    export KUBE_TOKEN=${HOCS_FRONTEND_QA_CS}
    export REPLICAS="1"
elif [[ ${KUBE_NAMESPACE} == "wcs-qa" ]] ; then
    echo "deploy ${VERSION} to QA namespace, using HOCS_FRONTEND_QA_WCS drone secret"
    export KUBE_TOKEN=${HOCS_FRONTEND_QA_WCS}
    export REPLICAS="1"
elif [[ ${KUBE_NAMESPACE} == "cs-demo" ]] ; then
    echo "deploy ${VERSION} to DEMO namespace, HOCS_FRONTEND_DEMO_CS drone secret"
    export KUBE_TOKEN=${HOCS_FRONTEND_DEMO_CS}
    export REPLICAS="1"
elif [[ ${KUBE_NAMESPACE} == "wcs-demo" ]] ; then
    echo "deploy ${VERSION} to DEMO namespace, HOCS_FRONTEND_DEMO_WCS drone secret"
    export KUBE_TOKEN=${HOCS_FRONTEND_DEMO_WCS}
    export REPLICAS="1"
elif [[ ${KUBE_NAMESPACE} == "cs-dev" ]] ; then
    echo "deploy ${VERSION} to DEV namespace, HOCS_FRONTEND_DEV_CS drone secret"
    export KUBE_TOKEN=${HOCS_FRONTEND_DEV_CS}
    export REPLICAS="1"
elif [[ ${KUBE_NAMESPACE} == "wcs-dev" ]] ; then
    echo "deploy ${VERSION} to DEV namespace, HOCS_FRONTEND_DEV_WCS drone secret"
    export KUBE_TOKEN=${HOCS_FRONTEND_DEV_WCS}
    export REPLICAS="1"
else
    echo "Unable to find environment: ${ENVIRONMENT}"
fi
    
if [[ -z ${KUBE_TOKEN} ]] ; then
    echo "Failed to find a value for KUBE_TOKEN - exiting"
    exit -1
fi

if [[ "${KUBE_NAMESPACE}" == "wcs-prod" ]] ; then
    export DNS_PREFIX=www.${DOMAIN}
    export KC_REALM=https://sso.digital.homeoffice.gov.uk/auth/realms/HOCS
elif [[ "${KUBE_NAMESPACE}" == "cs-prod" ]] ; then
    export DNS_PREFIX=www.${DOMAIN}
    export KC_REALM=https://sso.digital.homeoffice.gov.uk/auth/realms/hocs-prod
else
    export DNS_PREFIX=${DOMAIN}.${DOMAIN}-notprod
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
    -f service.yaml \
    -f autoscale.yaml
