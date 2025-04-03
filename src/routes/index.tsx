import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import arcjet, { validateEmail } from "@arcjet/node";
import { getWebRequest } from '@tanstack/react-start/server';


const aj = arcjet({

  key: "",

  rules: [

    validateEmail({

      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only

      // block disposable, invalid, and email addresses with no MX records

      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],

    }),

  ],

});



const test = createServerFn({ method: "POST" }).handler(async ({ context }) => {
  const req = getWebRequest()
  const decision = await aj.protect(req as any, { email: "test@test.com" })
  return decision.isAllowed()
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    console.log("Is email allowed?", await test())
  }
})

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome Home!!!</h3>
    </div>
  )
}
