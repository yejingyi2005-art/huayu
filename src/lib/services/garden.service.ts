import { supabase } from "../supabase/client";
import type { Garden, GardenMember } from "../types";
import { INVITE_CODE_LENGTH } from "../constants";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const gardenService = {
  async create(name: string, userId: string): Promise<Garden> {
    const inviteCode = generateInviteCode();
    const gardenId = crypto.randomUUID();

    const { error: gardenError } = await supabase
      .from("gardens")
      .insert({ garden_id: gardenId, name, invite_code: inviteCode });
    if (gardenError) throw { code: "GARDEN_CREATE_FAILED", message: gardenError.message };

    const { error: memberError } = await supabase.from("garden_members").insert({
      garden_id: gardenId,
      user_id: userId,
      role: "owner",
    });
    if (memberError) throw { code: "MEMBER_CREATE_FAILED", message: memberError.message };

    return { garden_id: gardenId, name, invite_code: inviteCode, created_at: new Date().toISOString(), status: "active" } as Garden;
  },

  async getById(id: string): Promise<Garden> {
    const { data, error } = await supabase.from("gardens").select().eq("garden_id", id).single();
    if (error) throw { code: "GARDEN_NOT_FOUND", message: error.message };
    return data as Garden;
  },

  async getByUser(userId: string): Promise<Garden[]> {
    const { data: members, error: memberError } = await supabase
      .from("garden_members")
      .select("garden_id")
      .eq("user_id", userId);
    if (memberError) throw { code: "MEMBERS_FETCH_FAILED", message: memberError.message };

    const ids = members.map((m: Pick<GardenMember, "garden_id">) => m.garden_id);
    if (ids.length === 0) return [];

    const { data: gardens, error: gardenError } = await supabase
      .from("gardens")
      .select()
      .in("garden_id", ids);
    if (gardenError) throw { code: "GARDENS_FETCH_FAILED", message: gardenError.message };
    return gardens as Garden[];
  },

  async join(inviteCode: string, userId: string): Promise<Garden> {
    const { data: garden, error: findError } = await supabase
      .from("gardens")
      .select()
      .eq("invite_code", inviteCode)
      .single();
    if (findError) throw { code: "INVITE_INVALID", message: "无效的邀请码" };

    const g = garden as Garden;
    const { error: memberError } = await supabase.from("garden_members").insert({
      garden_id: g.garden_id,
      user_id: userId,
      role: "member",
    });
    if (memberError) throw { code: "JOIN_FAILED", message: memberError.message };

    return g;
  },

  async getMembers(gardenId: string): Promise<GardenMember[]> {
    const { data, error } = await supabase
      .from("garden_members")
      .select()
      .eq("garden_id", gardenId);
    if (error) throw { code: "MEMBERS_FETCH_FAILED", message: error.message };
    return data as GardenMember[];
  },

  async archive(id: string): Promise<void> {
    const { error } = await supabase
      .from("gardens")
      .update({ status: "archived" })
      .eq("garden_id", id);
    if (error) throw { code: "GARDEN_ARCHIVE_FAILED", message: error.message };
  },
};
