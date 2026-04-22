import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "./Auth.css"
import { AbsoluteCenter } from "@chakra-ui/react";

export function AuthenticationPage() {
  return (
        <AbsoluteCenter>
            <div className="auth-container">
                <SignedOut>
                    <SignIn routing="path" path="/sign-in"/>
                    <SignUp routing="path" path="/sign-up"/>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </AbsoluteCenter>
    );
}
