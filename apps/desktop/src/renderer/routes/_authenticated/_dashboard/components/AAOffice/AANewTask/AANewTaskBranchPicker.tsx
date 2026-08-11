import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "@superset/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@superset/ui/popover";
import { useCallback, useState } from "react";
import { GoGitBranch } from "react-icons/go";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";
import { useBranchContext } from "renderer/routes/_authenticated/components/DashboardNewWorkspaceModal/components/DashboardNewWorkspaceForm/hooks/useBranchContext";

interface AANewTaskBranchPickerProps {
	hostId: string;
	projectId: string;
	value: string | null;
	onChange: (
		branch: string | null,
		source?: "local" | "remote-tracking",
	) => void;
}

export function AANewTaskBranchPicker({
	hostId,
	projectId,
	value,
	onChange,
}: AANewTaskBranchPickerProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");
	const {
		branches,
		defaultBranch,
		fetchNextPage,
		hasNextPage,
		isError,
		isFetchingNextPage,
		isLoading,
	} = useBranchContext(projectId, hostId, search);
	const loadMore = useCallback(() => {
		void fetchNextPage();
	}, [fetchNextPage]);

	return (
		<div className="aa-new-task-branch-field">
			<span className="aa-new-task-label">BASE BRANCH</span>
			<Popover
				open={open}
				onOpenChange={(next) => {
					setOpen(next);
					if (!next) setSearch("");
				}}
			>
				<PopoverTrigger asChild>
					<button
						type="button"
						className="aa-new-task-branch-trigger"
						aria-label={`Base branch: ${value ?? `Host default${defaultBranch ? ` (${defaultBranch})` : ""}`}`}
					>
						<GoGitBranch aria-hidden="true" />
						<span>{value ?? "HOST DEFAULT"}</span>
						<HiChevronUpDown aria-hidden="true" />
					</button>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					className="aa-new-task-branch-popover w-[360px] p-0"
				>
					<Command shouldFilter={false}>
						<CommandInput
							placeholder="Search base branches…"
							value={search}
							onValueChange={setSearch}
						/>
						<CommandList className="max-h-64">
							<CommandItem
								value="host-default"
								onSelect={() => {
									onChange(null);
									setOpen(false);
								}}
							>
								<span>Host default</span>
								{defaultBranch && (
									<span className="ml-1 font-mono text-[10px] text-muted-foreground">
										{defaultBranch}
									</span>
								)}
								{value === null && <HiCheck className="ml-auto size-3.5" />}
							</CommandItem>
							{!isLoading && !isError && branches.length === 0 && (
								<CommandEmpty>No branches found.</CommandEmpty>
							)}
							{isError && (
								<div className="select-text px-3 py-2 text-xs text-destructive">
									Could not load branches. Host default remains available.
								</div>
							)}
							{branches.map((branch) => (
								<CommandItem
									key={branch.name}
									value={branch.name}
									onSelect={() => {
										onChange(
											branch.name,
											branch.isLocal ? "local" : "remote-tracking",
										);
										setOpen(false);
									}}
								>
									<GoGitBranch className="size-3.5 shrink-0" />
									<span className="truncate font-mono text-xs">
										{branch.name}
									</span>
									{value === branch.name && (
										<HiCheck className="ml-auto size-3.5" />
									)}
								</CommandItem>
							))}
							{hasNextPage && (
								<button
									type="button"
									className="aa-new-task-load-more"
									disabled={isFetchingNextPage}
									onClick={loadMore}
								>
									{isFetchingNextPage ? "LOADING…" : "LOAD MORE"}
								</button>
							)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
