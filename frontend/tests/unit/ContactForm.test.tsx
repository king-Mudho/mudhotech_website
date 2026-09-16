import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/forms/ContactForm";
import { HONEYPOT_FIELD_NAME } from "@/lib/honeypot";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ success: true }),
  });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("ContactForm", () => {
  it("renders every required field", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("includes a hidden honeypot field", () => {
    const { container } = render(<ContactForm />);
    const honeypot = container.querySelector(`input[name="${HONEYPOT_FIELD_NAME}"]`);
    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
    expect(honeypot).toHaveAttribute("tabIndex", "-1");
  });

  it("shows validation errors and does not submit when fields are empty", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
    });
    // Human wording, not Zod's internal assertion text. An empty field is
    // "you missed this"; a filled-but-wrong one is "this isn't valid".
    expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your email address/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not submit when the email is malformed", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Tendai Moyo");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Subject"), "Website enquiry");
    await user.type(screen.getByLabelText("Message"), "I would like a new website for my business.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("links each error to its field so a screen reader announces it", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    const nameInput = await screen.findByLabelText("Name");
    await waitFor(() => expect(nameInput).toHaveAttribute("aria-invalid", "true"));

    const describedBy = nameInput.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const description = document.getElementById(describedBy!.split(" ")[0]);
    expect(description).toHaveTextContent(/please enter your full name/i);
    expect(description).toHaveAttribute("role", "alert");
  });

  it("replaces the form with a confirmation once the message is sent", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Tendai Moyo");
    await user.type(screen.getByLabelText("Email"), "tendai@example.com");
    await user.type(screen.getByLabelText("Subject"), "Website enquiry");
    await user.type(screen.getByLabelText("Message"), "I would like a new website for my business.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/message received/i)).toBeInTheDocument();
    expect(screen.queryByLabelText("Message")).not.toBeInTheDocument();
  });

  it("posts the correct payload to the contact endpoint on valid input", async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.type(screen.getByLabelText("Name"), "Tendai Moyo");
    await user.type(screen.getByLabelText("Email"), "tendai@example.com");
    await user.type(screen.getByLabelText("Subject"), "Website enquiry");
    await user.type(screen.getByLabelText("Message"), "I would like a new website for my business.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/submissions/contact");
    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      name: "Tendai Moyo",
      email: "tendai@example.com",
      subject: "Website enquiry",
      message: "I would like a new website for my business.",
    });
  });
});
