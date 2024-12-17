import { FormPaperFooter, FormPaperTitle } from "@/base/components/FormPaper";
import log from "@/base/log";
import LinkButton from "@ente/shared/components/LinkButton";
import SingleInputForm, {
    type SingleInputFormProps,
} from "@ente/shared/components/SingleInputForm";
import { LS_KEYS, setData, setLSUser } from "@ente/shared/storage/localStorage";
import { Input, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useRouter } from "next/router";
import { PAGES } from "../constants/pages";
import { getSRPAttributes } from "../services/srp-remote";
import { isSendOTTUserNotRegisteredError, sendOTT } from "../services/user";

interface LoginProps {
    signUp: () => void;
    /** Reactive value of {@link customAPIHost}. */
    host: string | undefined;
}

export const Login: React.FC<LoginProps> = ({ signUp, host }) => {
    const router = useRouter();

    const loginUser: SingleInputFormProps["callback"] = async (
        email,
        setFieldError,
    ) => {
        try {
            const srpAttributes = await getSRPAttributes(email);
            log.debug(() => ["srpAttributes", JSON.stringify(srpAttributes)]);
            if (!srpAttributes || srpAttributes.isEmailMFAEnabled) {
                try {
                    await sendOTT(email, "login");
                } catch (e) {
                    if (await isSendOTTUserNotRegisteredError(e)) {
                        setFieldError("No account with the given email exists");
                        return;
                    }
                    throw e;
                }
                await setLSUser({ email });
                void router.push(PAGES.VERIFY);
            } else {
                await setLSUser({ email });
                setData(LS_KEYS.SRP_ATTRIBUTES, srpAttributes);
                void router.push(PAGES.CREDENTIALS);
            }
        } catch (e) {
            log.error("Login failed", e);
            setFieldError(t("generic_error"));
        }
    };

    return (
        <>
            <FormPaperTitle>{t("login")}</FormPaperTitle>
            <SingleInputForm
                callback={loginUser}
                fieldType="email"
                placeholder={t("ENTER_EMAIL")}
                buttonText={t("login")}
                autoComplete="username"
                hiddenPostInput={
                    <Input sx={{ display: "none" }} type="password" value="" />
                }
            />

            <FormPaperFooter>
                <Stack gap={4}>
                    <LinkButton onClick={signUp}>{t("NO_ACCOUNT")}</LinkButton>

                    <Typography
                        variant="mini"
                        color="text.faint"
                        minHeight={"32px"}
                    >
                        {host ?? "" /* prevent layout shift with a minHeight */}
                    </Typography>
                </Stack>
            </FormPaperFooter>
        </>
    );
};
