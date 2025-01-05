import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Profile } from "@/types/profile"

export default function AgencySettings() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (user) {
        const profile: Profile = {
          id: user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
        }

        const { error: profileError } = await supabase
          .from("profiles")
          .update(profile)
          .eq("id", user.id)

        if (profileError) throw profileError

        toast({
          title: "Success",
          description: "User created successfully",
        })

        navigate("/agency/settings")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <h1>Agency Settings</h1>
      <form onSubmit={handleCreateUser}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Create User</Button>
      </form>
    </div>
  )
}
