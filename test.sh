
exec 3<> /dev/null
function red {
    printf "\e[91m$1\e[0m\n"
}
function green {
    printf "\e[32m$1\e[0m\n"
}

if [ "$1" = "--help" ]; then

cat << EOF

    /bin/bash $0 --help
    /bin/bash $0 --watch
    /bin/bash $0 --watchAll
    /bin/bash $0 --watchAll -t filter_tests_with_this_string

EOF

    exit 0
fi

JEST=""

set -e
set -x

if [ -f node_modules/.bin/jest ]; then  # exist

    { green "node_modules/.bin/jest - exists"; } 2>&3

    JEST="node node_modules/.bin/jest"
else

    { green "node_modules/.bin/jest - doesn't exist"; } 2>&3
fi

if [ "$JEST" = "" ]; then

    { green "local jest - not found"; } 2>&3

    jest -v > /dev/null

    STAT="$?"

    { green "(jest -v) status: $STAT"; } 2>&3

    if [ "$STAT" = "0" ]; then

        { green "global jest - found"; } 2>&3

        JEST="jest"
    else

        { red "\n    Can't detect jest, install globally: \n   npm install jest -g\n\n"; } 2>&3

        exit 1;
    fi
else

    { green "local jest - found"; } 2>&3
fi

## --bail \
#TEST="$(cat <<END
#$JEST \
#$@ \
#--roots test \
#--verbose \
#--runInBand \
#--modulePathIgnorePatterns test/examples test/jest test/minefield test/project test/puppeteer karma_build
#END
#)";

# --bail \
TEST="$(cat <<END
$JEST \
$@ \
--roots test \
--verbose \
--runInBand
END
)";

{ green "\n\n    executing tests:\n        $TEST\n\n"; } 2>&3

$TEST

STATUS=$?

if [ "$STATUS" = "0" ]; then

    { green "\n    Tests passed\n"; } 2>&3
else

    { red "\n    Tests crashed\n"; } 2>&3

    exit $STATUS
fi
