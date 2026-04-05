import { Link } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";

export default function NotFoundPage() {
  return (
    <div className="pb-10">
      <EmptyState
        title="That page doesn’t exist"
        description="The route could not be found, but the assistant and property catalog are still ready for you."
        action={
          <Link to="/" className="pill-button bg-slate-950 text-white">
            Return home
          </Link>
        }
      />
    </div>
  );
}
