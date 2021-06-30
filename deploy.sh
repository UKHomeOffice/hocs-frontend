#!/bin/bash
set -euo pipefail


export KUBE_NAMESPACE=${ENVIRONMENT}
export KUBE_TOKEN=${KUBE_TOKEN}
export VERSION=${VERSION}

export DOMAIN="cs"
if [ "${KUBE_NAMESPACE%-*}" == "wcs" ]; then
    export DOMAIN="wcs"
fi

export SUBNAMESPACE="${KUBE_NAMESPACE#*-}" # e.g. dev, qa

if [[ ${KUBE_NAMESPACE} == *prod ]]; then
    export MIN_REPLICAS="2"
    export MAX_REPLICAS="6"
    export ALLOWED_IPS=${POISE_IPS}
    export KUBE_SERVER=https://kube-api-prod.prod.acp.homeoffice.gov.uk
    export UPTIME_PERIOD="Mon-Sun 05:00-23:00 Europe/London"
    export KUBE_IS_NOTPROD=0
    export SHOW_ERROR_STACKTRACE=0
    
  if [[ "${KUBE_NAMESPACE}" == "wcs-prod" ]] ; then
      export DOMAIN_NAME="www.wcs.homeoffice.gov.uk"
      export INTERNAL_DOMAIN_NAME=''
      export KC_REALM=https://sso.digital.homeoffice.gov.uk/auth/realms/HOCS
  elif [[ "${KUBE_NAMESPACE}" == "cs-prod" ]] ; then
      export DOMAIN_NAME="www.cs.homeoffice.gov.uk"
      export INTERNAL_DOMAIN_NAME=''
      export KC_REALM=https://sso.digital.homeoffice.gov.uk/auth/realms/hocs-prod
  fi
else
    # non-production defaults:
    export MIN_REPLICAS="1"
    export MAX_REPLICAS="2"
    export UPTIME_PERIOD="Mon-Fri 08:00-18:00 Europe/London"
    export KC_REALM=https://sso-dev.notprod.homeoffice.gov.uk/auth/realms/hocs-notprod
    export KUBE_SERVER=https://kube-api-notprod.notprod.acp.homeoffice.gov.uk
    export ALLOWED_IPS=${POISE_IPS}

    export DOMAIN_NAME="${SUBNAMESPACE}.${DOMAIN}-notprod.homeoffice.gov.uk"
    export INTERNAL_DOMAIN_NAME="${SUBNAMESPACE}.internal.${DOMAIN}-notprod.homeoffice.gov.uk"
    export KUBE_IS_NOTPROD=1
    export SHOW_ERROR_STACKTRACE=1

    # but remove the ingress for demo (preprod)
    # so at least one non-prod namespace has prod-like keycloak-proxy settings
    if [[ ${KUBE_NAMESPACE} == *demo ]]; then
      export INTERNAL_DOMAIN_NAME=''
      # as kube-platform VPN doesn't get you into demo,
      # additionally allow acp-tunnel VPN IPs
      export ALLOWED_IPS="${POISE_IPS},${ACPTUNNEL_IPS}"
      export SHOW_ERROR_STACKTRACE=0
    fi
fi

echo
echo "Deploying hocs-frontend to ${ENVIRONMENT}"
echo "Keycloak realm: ${KC_REALM}"
echo "External domain: ${DOMAIN_NAME}"
echo "Internal domain: ${INTERNAL_DOMAIN_NAME:-not set}"
echo

cd kd

kd --insecure-skip-tls-verify \
   --timeout 10m \
    ${INTERNAL_DOMAIN_NAME:+ -f ingress-internal.yaml} \
    -f ingress-external.yaml \
    -f converter-configmap.yaml \
    -f configmap.yaml \
    -f deployment.yaml \
    -f service.yaml \
    -f autoscale.yaml
