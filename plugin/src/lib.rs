use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn deploy(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["railway"])?
        .with_exec(vec!["railway up", &args])?
        .stdout()?;
    Ok(stdout)
}
